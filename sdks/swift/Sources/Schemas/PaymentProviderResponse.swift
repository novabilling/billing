import Foundation

public struct PaymentProviderResponse: Codable, Hashable, Sendable {
    public let id: String
    public let providerName: String
    public let isActive: Bool
    public let priority: Double
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        providerName: String,
        isActive: Bool,
        priority: Double,
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.providerName = providerName
        self.isActive = isActive
        self.priority = priority
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.providerName = try container.decode(String.self, forKey: .providerName)
        self.isActive = try container.decode(Bool.self, forKey: .isActive)
        self.priority = try container.decode(Double.self, forKey: .priority)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.providerName, forKey: .providerName)
        try container.encode(self.isActive, forKey: .isActive)
        try container.encode(self.priority, forKey: .priority)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case providerName
        case isActive
        case priority
        case createdAt
        case updatedAt
    }
}