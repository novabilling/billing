/**
 * Mock PrismaClient factory for unit tests.
 * Returns an object with jest.fn() stubs for every tenant-schema model.
 */

function makeModelMock() {
  return {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  };
}

export function createMockPrisma() {
  return {
    customer: makeModelMock(),
    plan: makeModelMock(),
    planPrice: makeModelMock(),
    subscription: makeModelMock(),
    invoice: makeModelMock(),
    payment: makeModelMock(),
    paymentRetry: makeModelMock(),
    paymentProvider: makeModelMock(),
    coupon: makeModelMock(),
    appliedCoupon: makeModelMock(),
    addOn: makeModelMock(),
    addOnPrice: makeModelMock(),
    appliedAddOn: makeModelMock(),
    creditNote: makeModelMock(),
    billableMetric: makeModelMock(),
    billableMetricFilter: makeModelMock(),
    usageEvent: makeModelMock(),
    charge: makeModelMock(),
    chargeGraduatedRange: makeModelMock(),
    chargeFilter: makeModelMock(),
    wallet: makeModelMock(),
    walletTransaction: makeModelMock(),
    paymentMethod: makeModelMock(),
    tax: makeModelMock(),
    customerTax: makeModelMock(),
    planTax: makeModelMock(),
    chargeTax: makeModelMock(),
    planOverride: makeModelMock(),
    $transaction: jest.fn((fn: any) => fn({
      customer: makeModelMock(),
      wallet: makeModelMock(),
      walletTransaction: makeModelMock(),
      invoice: makeModelMock(),
      payment: makeModelMock(),
      subscription: makeModelMock(),
    })),
  };
}

export type MockPrisma = ReturnType<typeof createMockPrisma>;

/**
 * Reset all mocks on a MockPrisma instance.
 */
export function resetMockPrisma(db: MockPrisma) {
  for (const model of Object.values(db)) {
    if (typeof model === 'object' && model !== null) {
      for (const fn of Object.values(model)) {
        if (typeof fn === 'function' && 'mockClear' in fn) {
          (fn as jest.Mock).mockClear();
        }
      }
    }
  }
}
