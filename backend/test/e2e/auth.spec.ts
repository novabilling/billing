import { registerTenant, waitForApi, createJwtClient } from './setup';

const BASE_URL = process.env.E2E_API_URL || 'http://localhost:4000';

// E2E tests hit a live API with real DB provisioning — use generous timeouts
jest.setTimeout(60_000);

beforeAll(() => waitForApi(), 30_000);

describe('Auth E2E', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new tenant and return credentials', async () => {
      const ts = Date.now();
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Auth Test User',
          email: `auth-reg-${ts}@test.local`,
          password: 'SecurePass123',
          companyName: `Auth Corp ${ts}`,
        }),
      });

      expect(res.status).toBe(201);
      const data = await res.json();

      expect(data.tenant).toBeDefined();
      expect(data.tenant.id).toBeDefined();
      expect(data.tenant.email).toBe(`auth-reg-${ts}@test.local`);
      expect(data.tenant.slug).toContain('auth-corp');
      expect(data.tenant.isActive).toBe(true);
      expect(data.tenant.password).toBeUndefined();
      expect(data.apiKey).toBeDefined();
      expect(data.apiKey).toMatch(/^sk_live_/);
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      const ts = Date.now();
      const email = `auth-dup-${ts}@test.local`;
      const body = {
        name: 'Dup User',
        email,
        password: 'SecurePass123',
        companyName: 'Dup Corp',
      };

      const first = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      expect(first.status).toBe(201);

      const second = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      expect(second.status).toBe(409);
    });

    it('should validate required fields', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bad@test.local' }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    let email: string;
    const password = 'LoginTestPass1';

    beforeAll(async () => {
      const ts = Date.now();
      email = `auth-login-${ts}@test.local`;
      await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Login User',
          email,
          password,
          companyName: 'Login Corp',
        }),
      });
    });

    it('should login with valid credentials', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.tenant).toBeDefined();
      expect(data.tenant.email).toBe(email);
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
    });

    it('should reject wrong password', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'WrongPassword99' }),
      });
      expect(res.status).toBe(401);
    });

    it('should reject non-existent email', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ghost@nowhere.local', password: 'anything' }),
      });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;

    beforeAll(async () => {
      const tenant = await registerTenant('auth-refresh');
      refreshToken = tenant.refreshToken;
    });

    it('should issue new tokens with valid refresh token', async () => {
      // Wait 1s so JWT iat differs from original token
      await new Promise((r) => setTimeout(r, 1100));

      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: 'invalid.token.here' }),
      });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/tenants/me', () => {
    let tenant: Awaited<ReturnType<typeof registerTenant>>;

    beforeAll(async () => {
      tenant = await registerTenant('auth-me');
    });

    it('should return tenant profile with JWT', async () => {
      const jwt = createJwtClient(tenant.accessToken);
      const res = await jwt.get('/tenants/me');
      expect(res.status).toBe(200);
      expect(res.data.id).toBe(tenant.id);
      expect(res.data.email).toBe(tenant.email);
    });

    it('should reject unauthenticated request', async () => {
      const res = await fetch(`${BASE_URL}/api/tenants/me`);
      expect(res.status).toBe(401);
    });
  });
});
