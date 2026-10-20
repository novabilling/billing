import { readFileSync } from 'fs';
import { join } from 'path';
import Ajv, { ValidateFunction } from 'ajv';

/**
 * Checks a response body against a schema in the committed OpenAPI spec, the
 * one the SDKs are generated from. The value goes through JSON first, as it
 * does on the wire. Properties the spec does not list fail too: an SDK would
 * silently drop them.
 */
type Schema = Record<string, unknown>;

const spec = JSON.parse(readFileSync(join(__dirname, '../../openapi/openapi.json'), 'utf8')) as {
  components: { schemas: Record<string, Schema> };
};

const SCHEMA_KEYS = ['items', 'additionalProperties', 'not'];
const SCHEMA_LIST_KEYS = ['allOf', 'anyOf', 'oneOf'];
const mapValues = (o: Record<string, unknown>, f: (v: unknown) => unknown) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, f(v)]));

/** OpenAPI 3.0 to JSON Schema, tightened as described above. */
function tighten(schema: unknown): unknown {
  if (!schema || typeof schema !== 'object') return schema;
  const s: Schema = { ...(schema as Schema) };
  for (const key of SCHEMA_KEYS) if (s[key] && typeof s[key] === 'object') s[key] = tighten(s[key]);
  for (const key of SCHEMA_LIST_KEYS)
    if (Array.isArray(s[key])) s[key] = (s[key] as unknown[]).map(tighten);
  if (typeof s.$ref === 'string')
    s.$ref = s.$ref.replace('#/components/schemas/', '#/definitions/');
  if (s.properties) {
    const required = new Set((s.required as string[]) ?? []);
    s.properties = mapValues(s.properties as Record<string, unknown>, tighten);
    for (const [name, prop] of Object.entries(s.properties as Record<string, Schema>)) {
      // Optional fields may come back as null; the SDKs accept that.
      if (!required.has(name))
        (s.properties as Record<string, Schema>)[name] = { anyOf: [prop, { type: 'null' }] };
    }
    if (s.additionalProperties === undefined) s.additionalProperties = false;
  }
  if (s.nullable === true) {
    delete s.nullable;
    return { anyOf: [s, { type: 'null' }] };
  }
  return s;
}

const definitions = mapValues(spec.components.schemas, tighten) as Record<string, Schema>;
const ajv = new Ajv({ strict: false, allErrors: true, validateFormats: false });
const validators = new Map<string, ValidateFunction>();

export function responseShapeErrors(value: unknown, schemaName: string): string[] {
  if (!definitions[schemaName]) throw new Error(`No schema named ${schemaName} in openapi.json`);
  let validate = validators.get(schemaName);
  if (!validate) {
    validate = ajv.compile({ definitions, $ref: `#/definitions/${schemaName}` });
    validators.set(schemaName, validate);
  }
  const wire = JSON.parse(JSON.stringify(value)) as unknown;
  if (validate(wire)) return [];
  return (validate.errors ?? []).map(
    (e) => `${e.instancePath || '/'} ${e.message} ${JSON.stringify(e.params)}`,
  );
}

export function expectResponseShape(value: unknown, schemaName: string): void {
  expect(responseShapeErrors(value, schemaName)).toEqual([]);
}
