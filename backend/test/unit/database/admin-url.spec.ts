import { adminUrlFor } from '../../../src/database/migrations';

describe('adminUrlFor', () => {
  const admin = 'postgresql://postgres:s3cret@internal-tenant-db:5432/postgres';

  it("uses the admin's credentials on the tenant's database on the same server", () => {
    expect(adminUrlFor('postgresql://tenant_ab12:pw@internal-tenant-db:5432/tenant_ab12?schema=public', admin)).toEqual({
      url: 'postgresql://postgres:s3cret@internal-tenant-db:5432/tenant_ab12?schema=public',
      tenantUser: 'tenant_ab12',
    });
  });

  it("leaves databases on other servers to their own credentials", () => {
    expect(adminUrlFor('postgresql://u:pw@db.example.com:5432/t1', admin)).toBeNull();
    expect(adminUrlFor('postgresql://u:pw@internal-tenant-db:6543/t1', admin)).toBeNull();
    expect(adminUrlFor('postgresql://u:pw@internal-tenant-db:5432/t1', undefined)).toBeNull();
  });

  it('does nothing special when the tenant already connects as the admin', () => {
    expect(adminUrlFor('postgresql://postgres:s3cret@internal-tenant-db/t1', admin)).toBeNull();
  });
});
