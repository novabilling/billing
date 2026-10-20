#!/usr/bin/env node
// Type-checks the TypeScript and Python code in docs/content against the
// SDKs generated from the committed spec, so a renamed method, a wrong field
// or a wrong response shape in the docs fails CI.
//
//   cd fern && npx fern-api generate --local --group tier1
//   cd docs && node scripts/check-sdk-snippets.mjs [--sdks ../sdks]
//
// Each block is checked on its own. A block that does not create `client`
// gets one declared for it, and so do the objects a page creates in an
// earlier block and keeps using (customer, plan, ...), with their SDK types.
// Code that does not use the SDK (an Express
// webhook handler, say) is skipped by putting this line right above it:
//   <!-- snippet-check: skip -->
// Python is checked with pyright (it follows the SDK's lazily typed
// sub-clients, which mypy reads as Any); pydantic and httpx must be importable.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoDir = resolve(docsDir, '..');
const sdksArg = process.argv.indexOf('--sdks');
const sdksDir = resolve(sdksArg > 0 ? process.argv[sdksArg + 1] : join(repoDir, 'sdks'));
const contentDir = join(docsDir, 'content');
const SKIP = '<!-- snippet-check: skip -->';
const LANGS = { typescript: 'ts', ts: 'ts', python: 'py', py: 'py' };
// Variables a page carries over from an earlier block, and their SDK types.
const CARRIED = {
  customer: 'CustomerResponse',
  plan: 'PlanResponse',
  subscription: 'SubscriptionResponse',
  invoice: 'InvoiceResponse',
  payment: 'PaymentResponse',
  session: 'LoginResponse',
};
const uses = (code, name) => new RegExp(`(?<![.\\w])${name}\\b`).test(code);

function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? markdownFiles(join(dir, e.name)) : e.name.endsWith('.md') ? [join(dir, e.name)] : [],
  );
}

/** Fenced TypeScript and Python blocks, with the doc line their code starts on. */
function blocks(file) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const found = [];
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^\s*```(\w+)/);
    if (!open) continue;
    const end = lines.findIndex((l, j) => j > i && /^\s*```\s*$/.test(l));
    if (end < 0) break;
    const lang = LANGS[open[1]];
    const prev = lines
      .slice(0, i)
      .reverse()
      .find((l) => l.trim() !== '');
    if (lang && prev?.trim() !== SKIP) {
      const indent = open[0].match(/^\s*/)[0].length;
      const code = lines.slice(i + 1, end).map((l) => l.slice(indent));
      found.push({ file, lang, line: i + 2, code: code.join('\n') });
    }
    i = end;
  }
  return found;
}

function tsPrelude(code) {
  const imported = new Set(
    [...code.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]pimabill['"]/g)].flatMap((m) =>
      m[1].split(',').map((n) =>
        n
          .trim()
          .split(/\s+as\s+/)
          .pop(),
      ),
    ),
  );
  const needsClient = uses(code, 'client') && !/\b(const|let|var)\s+client\b/.test(code);
  const names = ['PimaBillClient', 'PimaBill', 'PimaBillError', 'PimaBillTimeoutError'].filter(
    (n) => !imported.has(n) && (new RegExp(`\\b${n}\\b`).test(code) || (needsClient && n === 'PimaBillClient')),
  );
  const carried = Object.entries(CARRIED).filter(
    ([v]) => uses(code, v) && !new RegExp(`\\b(const|let|var)\\s+${v}\\b`).test(code),
  );
  if (carried.length && !imported.has('PimaBill') && !names.includes('PimaBill')) names.push('PimaBill');
  const prelude = [];
  if (names.length) prelude.push(`import { ${names.join(', ')} } from 'pimabill';`);
  if (needsClient) prelude.push('declare const client: PimaBillClient;');
  for (const [v, type] of carried) prelude.push(`declare const ${v}: PimaBill.${type};`);
  return prelude;
}

function pyPrelude(code) {
  const prelude = [];
  const assigned = (v) => new RegExp(`^\\s*${v}\\s*=`, 'm').test(code);
  const imported = (n) => new RegExp(`^\\s*from pimabill import[^\\n]*\\b${n}\\b|^\\s*${n},?\\s*$`, 'm').test(code);
  const asyncClient = /\bawait\b/.test(code);
  const needsClient = uses(code, 'client') && !assigned('client');
  for (const n of ['PimaBill', 'AsyncPimaBill']) {
    // The client is created before the block's own imports run, so it brings its own.
    const forClient = needsClient && n === (asyncClient ? 'AsyncPimaBill' : 'PimaBill');
    if (forClient || (!imported(n) && uses(code, n))) prelude.push(`from pimabill import ${n}`);
  }
  if (needsClient) prelude.push(`client = ${asyncClient ? 'AsyncPimaBill' : 'PimaBill'}(token="sk_test")`);
  for (const [v, type] of Object.entries(CARRIED)) {
    if (uses(code, v) && !assigned(v)) {
      prelude.push(`from pimabill import ${type}`, `from typing import cast`, `${v} = cast(${type}, None)`);
    }
  }
  return prelude;
}

/** Top-level await is not valid Python, so such blocks run inside a coroutine. */
function pyBody(code) {
  if (!/\bawait\b/.test(code)) return code.split('\n');
  return ['async def _snippet() -> None:', ...code.split('\n').map((l) => (l ? `    ${l}` : l))];
}

const work = mkdtempSync(join(tmpdir(), 'sdk-snippets-'));
const sources = new Map(); // generated file -> { file, line, offset }
const all = markdownFiles(contentDir).flatMap(blocks);

for (const [i, b] of all.entries()) {
  const name = `${relative(contentDir, b.file).replace(/[^\w]+/g, '_')}_${b.line}`;
  if (b.lang === 'ts') {
    const prelude = tsPrelude(b.code);
    const path = join(work, 'ts', `${name}.ts`);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, [...prelude, b.code, 'export {};', ''].join('\n'));
    sources.set(path, { ...b, offset: prelude.length });
  } else {
    const prelude = pyPrelude(b.code);
    const body = pyBody(b.code);
    const path = join(work, 'py', `snippet_${i}_${name}.py`);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, [...prelude, ...body, ''].join('\n'));
    // A wrapped block has one extra line (the def) before its code.
    sources.set(path, { ...b, offset: prelude.length + (body.length > b.code.split('\n').length ? 1 : 0) });
  }
}

writeFileSync(
  join(work, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      types: ['node'],
      typeRoots: [join(docsDir, 'node_modules/@types')],
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      paths: { pimabill: [join(sdksDir, 'typescript/index.ts')] },
    },
    include: ['ts/**/*.ts'],
  }),
);
symlinkSync(join(sdksDir, 'python'), join(work, 'pimabill'));
writeFileSync(
  join(work, 'pyrightconfig.json'),
  // Generated code is ignored; only the snippets are under test.
  JSON.stringify({ include: ['py'], ignore: ['pimabill'], extraPaths: [work], typeCheckingMode: 'standard' }),
);

function run(cmd, args, env = {}) {
  try {
    execFileSync(cmd, args, { cwd: work, encoding: 'utf8', stdio: 'pipe', env: { ...process.env, ...env } });
    return '';
  } catch (e) {
    if (e.code === 'ENOENT') throw new Error(`${cmd} is not installed`);
    return `${e.stdout ?? ''}${e.stderr ?? ''}`;
  }
}

const errors = [];
const tsc = join(docsDir, 'node_modules/.bin/tsc');
for (const m of run(tsc, ['-p', 'tsconfig.json', '--pretty', 'false']).matchAll(/^(.+?)\((\d+),\d+\): error (.+)$/gm)) {
  errors.push([resolve(work, m[1]), Number(m[2]), m[3]]);
}
const pyright = JSON.parse(run(join(docsDir, 'node_modules/.bin/pyright'), ['--outputjson']) || '{"generalDiagnostics":[]}');
for (const d of pyright.generalDiagnostics.filter((d) => d.severity === 'error')) {
  errors.push([d.file, d.range.start.line + 1, d.message.replace(/\s+/g, ' ')]);
}

let count = 0;
for (const [path, line, message] of errors) {
  const source = sources.get(path);
  if (!source) {
    // An error inside the SDK itself, not in a snippet.
    console.log(`::error::${relative(work, path)}:${line}: ${message}`);
    count++;
    continue;
  }
  const docLine = source.line + line - 1 - source.offset;
  const file = relative(repoDir, source.file);
  console.log(`::error file=${file},line=${docLine}::${message}`);
  count++;
}

const ts = all.filter((b) => b.lang === 'ts').length;
console.log(`Checked ${ts} TypeScript and ${all.length - ts} Python snippets: ${count} error(s).`);
if (count === 0) rmSync(work, { recursive: true, force: true });
else console.log(`Generated files kept in ${work}`);
process.exit(count ? 1 : 0);
