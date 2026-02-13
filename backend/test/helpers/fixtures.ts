/**
 * Reusable test data factories.
 * All return sensible defaults, overridable via partial parameter.
 */

const now = new Date('2026-01-15T12:00:00Z');

export function makeTenant(overrides: Record<string, any> = {}) {
  return {
    id: 'tenant_1',
    name: 'Acme Corp',
    slug: 'acme-corp',
    email: 'admin@acme.com',
    password: '$argon2id$hashed',
    apiKey: 'nb_test_key_123',
    webhookUrl: 'https://acme.com/webhooks',
    webhookSecret: 'whsec_test',
    isActive: true,
    settings: {},
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeCustomer(overrides: Record<string, any> = {}) {
  return {
    id: 'cust_1',
    externalId: 'ext_cust_1',
    email: 'customer@example.com',
    name: 'Test Customer',
    phone: null,
    address: null,
    city: null,
    state: null,
    zipCode: null,
    country: 'US',
    currency: 'USD',
    taxId: null,
    netPaymentTerms: null,
    metadata: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makePlan(overrides: Record<string, any> = {}) {
  return {
    id: 'plan_1',
    name: 'Pro Monthly',
    code: 'pro_monthly',
    description: 'Pro plan with all features',
    billingInterval: 'MONTHLY',
    billingTiming: 'IN_ARREARS',
    features: ['Feature A', 'Feature B'],
    isActive: true,
    minimumCommitment: null,
    netPaymentTerms: null,
    invoiceGracePeriodDays: null,
    progressiveBillingThreshold: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makePlanPrice(overrides: Record<string, any> = {}) {
  return {
    id: 'price_1',
    planId: 'plan_1',
    currency: 'USD',
    amount: '49.00',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeSubscription(overrides: Record<string, any> = {}) {
  return {
    id: 'sub_1',
    externalId: 'ext_sub_1',
    customerId: 'cust_1',
    planId: 'plan_1',
    status: 'ACTIVE',
    currency: 'USD',
    currentPeriodStart: new Date('2026-01-01T00:00:00Z'),
    currentPeriodEnd: new Date('2026-02-01T00:00:00Z'),
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: null,
    canceledAt: null,
    billingTiming: 'IN_ARREARS',
    lastProgressiveBillingAt: null,
    metadata: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeInvoice(overrides: Record<string, any> = {}) {
  return {
    id: 'inv_1',
    invoiceNumber: 'INV-2026-0001',
    customerId: 'cust_1',
    subscriptionId: 'sub_1',
    status: 'PENDING',
    currency: 'USD',
    totalAmount: '49.00',
    paidAmount: '0.00',
    dueDate: new Date('2026-02-15T00:00:00Z'),
    paidAt: null,
    periodStart: new Date('2026-01-01T00:00:00Z'),
    periodEnd: new Date('2026-02-01T00:00:00Z'),
    lineItems: [],
    metadata: {},
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makePayment(overrides: Record<string, any> = {}) {
  return {
    id: 'pay_1',
    invoiceId: 'inv_1',
    amount: '49.00',
    currency: 'USD',
    status: 'COMPLETED',
    provider: 'flutterwave',
    providerTransactionId: 'flw_tx_123',
    providerReference: 'ref_123',
    metadata: {},
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeTax(overrides: Record<string, any> = {}) {
  return {
    id: 'tax_1',
    name: 'VAT',
    code: 'vat',
    rate: '18.00',
    description: 'Value Added Tax',
    appliedByDefault: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeWallet(overrides: Record<string, any> = {}) {
  return {
    id: 'wallet_1',
    customerId: 'cust_1',
    name: 'Main Wallet',
    currency: 'USD',
    rateAmount: '1.00',
    status: 'ACTIVE',
    balanceCredits: '100.00',
    consumedCredits: '0.00',
    expirationAt: null,
    metadata: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeWalletTransaction(overrides: Record<string, any> = {}) {
  return {
    id: 'wtx_1',
    walletId: 'wallet_1',
    type: 'INBOUND',
    transactionType: 'PURCHASED',
    status: 'SETTLED',
    amount: '100.00',
    creditAmount: '100.00',
    invoiceId: null,
    metadata: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeBillableMetric(overrides: Record<string, any> = {}) {
  return {
    id: 'metric_1',
    name: 'API Calls',
    code: 'api_calls',
    description: 'Number of API calls',
    aggregationType: 'COUNT',
    fieldName: null,
    recurring: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeCharge(overrides: Record<string, any> = {}) {
  return {
    id: 'charge_1',
    planId: 'plan_1',
    billableMetricId: 'metric_1',
    chargeModel: 'STANDARD',
    invoiceDisplayName: 'API Usage',
    payInAdvance: false,
    prorated: false,
    properties: { unitAmount: '0.01' },
    minAmountCents: null,
    metadata: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeChargeGraduatedRange(overrides: Record<string, any> = {}) {
  return {
    id: 'range_1',
    chargeId: 'charge_1',
    fromValue: 0,
    toValue: 1000,
    perUnitAmount: '0.01',
    flatAmount: '0.00',
    ...overrides,
  };
}

export function makeCoupon(overrides: Record<string, any> = {}) {
  return {
    id: 'coupon_1',
    name: '10% Off',
    code: 'SAVE10',
    discountType: 'PERCENTAGE',
    discountValue: '10.00',
    currency: null,
    frequency: 'ONCE',
    isActive: true,
    maxRedemptions: null,
    redemptionCount: 0,
    expiresAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeAppliedCoupon(overrides: Record<string, any> = {}) {
  return {
    id: 'acpn_1',
    customerId: 'cust_1',
    couponId: 'coupon_1',
    status: 'ACTIVE',
    amountUsed: '0.00',
    frequencyDuration: null,
    frequencyDurationRemaining: null,
    createdAt: now,
    ...overrides,
  };
}

export function makeCreditNote(overrides: Record<string, any> = {}) {
  return {
    id: 'cn_1',
    invoiceId: 'inv_1',
    customerId: 'cust_1',
    creditNoteNumber: 'CN-2026-0001',
    reason: 'other',
    description: 'Test credit note',
    totalAmount: '10.00',
    currency: 'USD',
    status: 'ISSUED',
    refundAmount: '0.00',
    creditAmount: '10.00',
    balanceAmount: '10.00',
    metadata: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makePlanOverride(overrides: Record<string, any> = {}) {
  return {
    id: 'po_1',
    customerId: 'cust_1',
    planId: 'plan_1',
    overriddenPrices: [{ currency: 'USD', amount: 39 }],
    overriddenMinimumCommitment: null,
    overriddenCharges: null,
    metadata: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeUsageEvent(overrides: Record<string, any> = {}) {
  return {
    id: 'evt_1',
    transactionId: 'txn_unique_1',
    subscriptionId: 'sub_1',
    code: 'api_calls',
    timestamp: now,
    properties: {},
    createdAt: now,
    ...overrides,
  };
}

export function makePaymentProvider(overrides: Record<string, any> = {}) {
  return {
    id: 'pp_1',
    name: 'flutterwave',
    type: 'flutterwave',
    isActive: true,
    isDefault: true,
    credentials: { publicKey: 'pk_test', secretKey: 'sk_test' },
    metadata: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
