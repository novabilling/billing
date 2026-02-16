import Foundation

public struct CouponResponse: Codable, Hashable, Sendable {
    public let id: String
    public let code: String
    public let name: String
    public let description: String?
    public let discountType: CouponResponseDiscountType
    /// Discount value as decimal string
    public let discountValue: String
    public let currency: String?
    public let maxRedemptions: Double?
    public let redemptionCount: Double
    public let appliesToPlanIds: [String]
    public let isActive: Bool
    public let expiresAt: String?
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        code: String,
        name: String,
        description: String? = nil,
        discountType: CouponResponseDiscountType,
        discountValue: String,
        currency: String? = nil,
        maxRedemptions: Double? = nil,
        redemptionCount: Double,
        appliesToPlanIds: [String],
        isActive: Bool,
        expiresAt: String? = nil,
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.code = code
        self.name = name
        self.description = description
        self.discountType = discountType
        self.discountValue = discountValue
        self.currency = currency
        self.maxRedemptions = maxRedemptions
        self.redemptionCount = redemptionCount
        self.appliesToPlanIds = appliesToPlanIds
        self.isActive = isActive
        self.expiresAt = expiresAt
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.code = try container.decode(String.self, forKey: .code)
        self.name = try container.decode(String.self, forKey: .name)
        self.description = try container.decodeIfPresent(String.self, forKey: .description)
        self.discountType = try container.decode(CouponResponseDiscountType.self, forKey: .discountType)
        self.discountValue = try container.decode(String.self, forKey: .discountValue)
        self.currency = try container.decodeIfPresent(String.self, forKey: .currency)
        self.maxRedemptions = try container.decodeIfPresent(Double.self, forKey: .maxRedemptions)
        self.redemptionCount = try container.decode(Double.self, forKey: .redemptionCount)
        self.appliesToPlanIds = try container.decode([String].self, forKey: .appliesToPlanIds)
        self.isActive = try container.decode(Bool.self, forKey: .isActive)
        self.expiresAt = try container.decodeIfPresent(String.self, forKey: .expiresAt)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.code, forKey: .code)
        try container.encode(self.name, forKey: .name)
        try container.encodeIfPresent(self.description, forKey: .description)
        try container.encode(self.discountType, forKey: .discountType)
        try container.encode(self.discountValue, forKey: .discountValue)
        try container.encodeIfPresent(self.currency, forKey: .currency)
        try container.encodeIfPresent(self.maxRedemptions, forKey: .maxRedemptions)
        try container.encode(self.redemptionCount, forKey: .redemptionCount)
        try container.encode(self.appliesToPlanIds, forKey: .appliesToPlanIds)
        try container.encode(self.isActive, forKey: .isActive)
        try container.encodeIfPresent(self.expiresAt, forKey: .expiresAt)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case code
        case name
        case description
        case discountType
        case discountValue
        case currency
        case maxRedemptions
        case redemptionCount
        case appliesToPlanIds
        case isActive
        case expiresAt
        case createdAt
        case updatedAt
    }
}