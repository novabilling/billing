import { readFileSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';

// The SDKs take their group and method names from fern/overrides.yml. A new
// endpoint without an entry gets a generated name (e.g. postApiPayouts), and
// an entry for a removed endpoint breaks generation, so both fail here.
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

type Operations = Record<string, Record<string, Record<string, unknown>>>;

const spec = JSON.parse(readFileSync(join(__dirname, '../../../openapi/openapi.json'), 'utf8')) as {
  paths: Operations;
};
const overrides = (
  load(readFileSync(join(__dirname, '../../../../fern/overrides.yml'), 'utf8')) as {
    paths: Operations;
  }
).paths;

function operations(paths: Operations): string[] {
  return Object.entries(paths).flatMap(([path, ops]) =>
    Object.keys(ops ?? {})
      .filter((method) => METHODS.includes(method))
      .map((method) => `${method.toUpperCase()} ${path}`),
  );
}

describe('fern/overrides.yml', () => {
  it('names every operation in the spec', () => {
    const named = new Set(operations(overrides));
    expect(operations(spec.paths).filter((op) => !named.has(op))).toEqual([]);
  });

  it('has no entries for operations the spec no longer has', () => {
    const existing = new Set(operations(spec.paths));
    expect(operations(overrides).filter((op) => !existing.has(op))).toEqual([]);
  });

  it('gives each operation a group and method name, or leaves it out of the SDKs', () => {
    const incomplete = Object.entries(overrides).flatMap(([path, ops]) =>
      Object.entries(ops)
        .filter(
          ([, o]) =>
            o['x-fern-ignore'] !== true &&
            !(o['x-fern-sdk-group-name'] && o['x-fern-sdk-method-name']),
        )
        .map(([method]) => `${method.toUpperCase()} ${path}`),
    );
    expect(incomplete).toEqual([]);
  });

  it('does not give two operations the same SDK method', () => {
    const seen = new Map<string, string[]>();
    for (const [path, ops] of Object.entries(overrides)) {
      for (const [method, o] of Object.entries(ops)) {
        if (o['x-fern-ignore'] === true) continue;
        const name = `${o['x-fern-sdk-group-name']}.${o['x-fern-sdk-method-name']}`;
        seen.set(name, [...(seen.get(name) ?? []), `${method.toUpperCase()} ${path}`]);
      }
    }
    expect([...seen].filter(([, ops]) => ops.length > 1)).toEqual([]);
  });
});
