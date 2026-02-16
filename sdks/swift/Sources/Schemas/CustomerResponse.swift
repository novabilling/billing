import Foundation

public struct CustomerResponse: Codable, Hashable, Sendable {
    public let id: String
    public let externalId: String
    public let email: String
    public let name: String?
    public let country: String?
    public let currency: String
    public let metadata: [String: JSONValue]?
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        externalId: String,
        email: String,
        name: String? = nil,
        country: String? = nil,
        currency: String,
        metadata: [String: JSONValue]? = nil,
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.externalId = externalId
        self.email = email
        self.name = name
        self.country = country
        self.currency = currency
        self.metadata = metadata
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.externalId = try container.decode(String.self, forKey: .externalId)
        self.email = try container.decode(String.self, forKey: .email)
        self.name = try container.decodeIfPresent(String.self, forKey: .name)
        self.country = try container.decodeIfPresent(String.self, forKey: .country)
        self.currency = try container.decode(String.self, forKey: .currency)
        self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.externalId, forKey: .externalId)
        try container.encode(self.email, forKey: .email)
        try container.encodeIfPresent(self.name, forKey: .name)
        try container.encodeIfPresent(self.country, forKey: .country)
        try container.encode(self.currency, forKey: .currency)
        try container.encodeIfPresent(self.metadata, forKey: .metadata)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case externalId
        case email
        case name
        case country
        case currency
        case metadata
        case createdAt
        case updatedAt
    }
}