import Foundation

public struct AppliedCouponResponse: Codable, Hashable, Sendable {
    public let id: String
    public let couponId: String
    public let customerId: String
    public let subscriptionId: String?
    public let amountOff: String?
    public let usesRemaining: Double?
    public let createdAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        couponId: String,
        customerId: String,
        subscriptionId: String? = nil,
        amountOff: String? = nil,
        usesRemaining: Double? = nil,
        createdAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.couponId = couponId
        self.customerId = customerId
        self.subscriptionId = subscriptionId
        self.amountOff = amountOff
        self.usesRemaining = usesRemaining
        self.createdAt = createdAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.couponId = try container.decode(String.self, forKey: .couponId)
        self.customerId = try container.decode(String.self, forKey: .customerId)
        self.subscriptionId = try container.decodeIfPresent(String.self, forKey: .subscriptionId)
        self.amountOff = try container.decodeIfPresent(String.self, forKey: .amountOff)
        self.usesRemaining = try container.decodeIfPresent(Double.self, forKey: .usesRemaining)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.couponId, forKey: .couponId)
        try container.encode(self.customerId, forKey: .customerId)
        try container.encodeIfPresent(self.subscriptionId, forKey: .subscriptionId)
        try container.encodeIfPresent(self.amountOff, forKey: .amountOff)
        try container.encodeIfPresent(self.usesRemaining, forKey: .usesRemaining)
        try container.encode(self.createdAt, forKey: .createdAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case couponId
        case customerId
        case subscriptionId
        case amountOff
        case usesRemaining
        case createdAt
    }
}