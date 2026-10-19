import { detectClient, UsageService } from '../../../src/modules/platform/usage.service';

describe('detectClient', () => {
  it('prefers Fern SDK headers', () => {
    expect(detectClient({ 'x-fern-sdk-name': 'novabilling', 'x-fern-sdk-version': '1.4.0', 'user-agent': 'node' })).toBe(
      'novabilling@1.4.0',
    );
  });

  it('falls back to user-agent families', () => {
    expect(detectClient({ 'user-agent': 'python-requests/2.31' })).toBe('python');
    expect(detectClient({ 'user-agent': 'Mozilla/5.0' })).toBe('browser');
    expect(detectClient({ 'user-agent': 'Dart/3.4 (dart:io)' })).toBe('dart');
    expect(detectClient({ 'user-agent': 'curl/8.0' })).toBe('curl');
    expect(detectClient({})).toBe('http');
  });
});

describe('UsageService', () => {
  const executeRaw = jest.fn().mockResolvedValue(1);
  const service = new UsageService({ client: { $executeRaw: executeRaw } } as never);

  beforeEach(() => executeRaw.mockClear());

  it('aggregates samples per tenant, route and client before flushing', async () => {
    const base = { tenantId: 't1', route: 'GET /api/customers', authMethod: 'api_key', client: 'python' };
    service.record({ ...base, status: 200, durationMs: 10 });
    service.record({ ...base, status: 404, durationMs: 30 });
    service.record({ ...base, status: 503, durationMs: 5 });
    service.record({ ...base, client: 'node', status: 200, durationMs: 1 });

    await service.flush();

    expect(executeRaw).toHaveBeenCalledTimes(2);
    const values = executeRaw.mock.calls[0].slice(1);
    // tenantId, hour, route, authMethod, client, requests, clientErrors, serverErrors, totalMs, maxMs
    expect(values[0]).toBe('t1');
    expect(values.slice(5)).toEqual([3, 1, 1, 45n, 30]);
  });

  it('never throws when the central database is unavailable', async () => {
    executeRaw.mockRejectedValueOnce(new Error('down'));
    service.record({ tenantId: 't1', route: 'GET /x', authMethod: 'api_key', client: 'http', status: 200, durationMs: 1 });
    await expect(service.flush()).resolves.toBeUndefined();
  });
});
