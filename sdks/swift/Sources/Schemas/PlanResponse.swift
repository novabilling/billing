import Foundation

public struct PlanResponse: Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let code: String
    public let description: String?
    public let billingInterval: PlanResponseBillingInterval
    public let features: [String]?
    public let isActive: Bool
    public let billingTiming: PlanResponseBillingTiming
    /// Minimum commitment amount
    public let minimumCommitment: String?
    public let prices: [PlanPriceResponse]
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        name: String,
        code: String,
        description: String? = nil,
        billingInterval: PlanResponseBillingInterval,
        features: [String]? = nil,
        isActive: Bool,
        billingTiming: PlanResponseBillingTiming,
        minimumCommitment: String? = nil,
        prices: [PlanPriceResponse],
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.name = name
        self.code = code
        self.description = description
        self.billingInterval = billingInterval
        self.features = features
        self.isActive = isActive
        self.billingTiming = billingTiming
        self.minimumCommitment = minimumCommitment
        self.prices = prices
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.name = try container.decode(String.self, forKey: .name)
        self.code = try container.decode(String.self, forKey: .code)
        self.description = try container.decodeIfPresent(String.self, forKey: .description)
        self.billingInterval = try container.decode(PlanResponseBillingInterval.self, forKey: .billingInterval)
        self.features = try container.decodeIfPresent([String].self, forKey: .features)
        self.isActive = try container.decode(Bool.self, forKey: .isActive)
        self.billingTiming = try container.decode(PlanResponseBillingTiming.self, forKey: .billingTiming)
        self.minimumCommitment = try container.decodeIfPresent(String.self, forKey: .minimumCommitment)
        self.prices = try container.decode([PlanPriceResponse].self, forKey: .prices)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.name, forKey: .name)
        try container.encode(self.code, forKey: .code)
        try container.encodeIfPresent(self.description, forKey: .description)
        try container.encode(self.billingInterval, forKey: .billingInterval)
        try container.encodeIfPresent(self.features, forKey: .features)
        try container.encode(self.isActive, forKey: .isActive)
        try container.encode(self.billingTiming, forKey: .billingTiming)
        try container.encodeIfPresent(self.minimumCommitment, forKey: .minimumCommitment)
        try container.encode(self.prices, forKey: .prices)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case name
        case code
        case description
        case billingInterval
        case features
        case isActive
        case billingTiming
        case minimumCommitment
        case prices
        case createdAt
        case updatedAt
    }
}