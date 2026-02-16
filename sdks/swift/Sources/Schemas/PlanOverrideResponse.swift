import Foundation

public struct PlanOverrideResponse: Codable, Hashable, Sendable {
    public let id: String
    public let customerId: String
    public let planId: String
    public let overriddenPrices: [String: JSONValue]?
    public let overriddenMinimumCommitment: Double?
    public let overriddenCharges: [String: JSONValue]?
    public let metadata: [String: JSONValue]?
    public let createdAt: Date
    public let updatedAt: Date
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        customerId: String,
        planId: String,
        overriddenPrices: [String: JSONValue]? = nil,
        overriddenMinimumCommitment: Double? = nil,
        overriddenCharges: [String: JSONValue]? = nil,
        metadata: [String: JSONValue]? = nil,
        createdAt: Date,
        updatedAt: Date,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.customerId = customerId
        self.planId = planId
        self.overriddenPrices = overriddenPrices
        self.overriddenMinimumCommitment = overriddenMinimumCommitment
        self.overriddenCharges = overriddenCharges
        self.metadata = metadata
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.customerId = try container.decode(String.self, forKey: .customerId)
        self.planId = try container.decode(String.self, forKey: .planId)
        self.overriddenPrices = try container.decodeIfPresent([String: JSONValue].self, forKey: .overriddenPrices)
        self.overriddenMinimumCommitment = try container.decodeIfPresent(Double.self, forKey: .overriddenMinimumCommitment)
        self.overriddenCharges = try container.decodeIfPresent([String: JSONValue].self, forKey: .overriddenCharges)
        self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
        self.createdAt = try container.decode(Date.self, forKey: .createdAt)
        self.updatedAt = try container.decode(Date.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.customerId, forKey: .customerId)
        try container.encode(self.planId, forKey: .planId)
        try container.encodeIfPresent(self.overriddenPrices, forKey: .overriddenPrices)
        try container.encodeIfPresent(self.overriddenMinimumCommitment, forKey: .overriddenMinimumCommitment)
        try container.encodeIfPresent(self.overriddenCharges, forKey: .overriddenCharges)
        try container.encodeIfPresent(self.metadata, forKey: .metadata)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case customerId
        case planId
        case overriddenPrices
        case overriddenMinimumCommitment
        case overriddenCharges
        case metadata
        case createdAt
        case updatedAt
    }
}