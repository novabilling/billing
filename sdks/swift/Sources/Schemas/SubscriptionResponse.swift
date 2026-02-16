import Foundation

public struct SubscriptionResponse: Codable, Hashable, Sendable {
    public let id: String
    public let externalId: String?
    public let customerId: String
    public let planId: String
    public let previousPlanId: String?
    public let status: SubscriptionResponseStatus
    public let currency: String
    public let billingTiming: SubscriptionResponseBillingTiming
    public let currentPeriodStart: String
    public let currentPeriodEnd: String
    public let cancelAt: String?
    public let canceledAt: String?
    public let trialStart: String?
    public let trialEnd: String?
    public let startedAt: String
    public let metadata: [String: JSONValue]?
    public let customer: SubscriptionCustomerResponse?
    public let plan: SubscriptionPlanResponse?
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        externalId: String? = nil,
        customerId: String,
        planId: String,
        previousPlanId: String? = nil,
        status: SubscriptionResponseStatus,
        currency: String,
        billingTiming: SubscriptionResponseBillingTiming,
        currentPeriodStart: String,
        currentPeriodEnd: String,
        cancelAt: String? = nil,
        canceledAt: String? = nil,
        trialStart: String? = nil,
        trialEnd: String? = nil,
        startedAt: String,
        metadata: [String: JSONValue]? = nil,
        customer: SubscriptionCustomerResponse? = nil,
        plan: SubscriptionPlanResponse? = nil,
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.externalId = externalId
        self.customerId = customerId
        self.planId = planId
        self.previousPlanId = previousPlanId
        self.status = status
        self.currency = currency
        self.billingTiming = billingTiming
        self.currentPeriodStart = currentPeriodStart
        self.currentPeriodEnd = currentPeriodEnd
        self.cancelAt = cancelAt
        self.canceledAt = canceledAt
        self.trialStart = trialStart
        self.trialEnd = trialEnd
        self.startedAt = startedAt
        self.metadata = metadata
        self.customer = customer
        self.plan = plan
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.externalId = try container.decodeIfPresent(String.self, forKey: .externalId)
        self.customerId = try container.decode(String.self, forKey: .customerId)
        self.planId = try container.decode(String.self, forKey: .planId)
        self.previousPlanId = try container.decodeIfPresent(String.self, forKey: .previousPlanId)
        self.status = try container.decode(SubscriptionResponseStatus.self, forKey: .status)
        self.currency = try container.decode(String.self, forKey: .currency)
        self.billingTiming = try container.decode(SubscriptionResponseBillingTiming.self, forKey: .billingTiming)
        self.currentPeriodStart = try container.decode(String.self, forKey: .currentPeriodStart)
        self.currentPeriodEnd = try container.decode(String.self, forKey: .currentPeriodEnd)
        self.cancelAt = try container.decodeIfPresent(String.self, forKey: .cancelAt)
        self.canceledAt = try container.decodeIfPresent(String.self, forKey: .canceledAt)
        self.trialStart = try container.decodeIfPresent(String.self, forKey: .trialStart)
        self.trialEnd = try container.decodeIfPresent(String.self, forKey: .trialEnd)
        self.startedAt = try container.decode(String.self, forKey: .startedAt)
        self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
        self.customer = try container.decodeIfPresent(SubscriptionCustomerResponse.self, forKey: .customer)
        self.plan = try container.decodeIfPresent(SubscriptionPlanResponse.self, forKey: .plan)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encodeIfPresent(self.externalId, forKey: .externalId)
        try container.encode(self.customerId, forKey: .customerId)
        try container.encode(self.planId, forKey: .planId)
        try container.encodeIfPresent(self.previousPlanId, forKey: .previousPlanId)
        try container.encode(self.status, forKey: .status)
        try container.encode(self.currency, forKey: .currency)
        try container.encode(self.billingTiming, forKey: .billingTiming)
        try container.encode(self.currentPeriodStart, forKey: .currentPeriodStart)
        try container.encode(self.currentPeriodEnd, forKey: .currentPeriodEnd)
        try container.encodeIfPresent(self.cancelAt, forKey: .cancelAt)
        try container.encodeIfPresent(self.canceledAt, forKey: .canceledAt)
        try container.encodeIfPresent(self.trialStart, forKey: .trialStart)
        try container.encodeIfPresent(self.trialEnd, forKey: .trialEnd)
        try container.encode(self.startedAt, forKey: .startedAt)
        try container.encodeIfPresent(self.metadata, forKey: .metadata)
        try container.encodeIfPresent(self.customer, forKey: .customer)
        try container.encodeIfPresent(self.plan, forKey: .plan)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case externalId
        case customerId
        case planId
        case previousPlanId
        case status
        case currency
        case billingTiming
        case currentPeriodStart
        case currentPeriodEnd
        case cancelAt
        case canceledAt
        case trialStart
        case trialEnd
        case startedAt
        case metadata
        case customer
        case plan
        case createdAt
        case updatedAt
    }
}