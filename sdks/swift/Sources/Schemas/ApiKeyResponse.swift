import Foundation

public struct ApiKeyResponse: Codable, Hashable, Sendable {
    public let id: String
    public let key: String
    public let name: String
    public let scopes: [String]
    public let lastUsed: String?
    public let expiresAt: String?
    public let createdAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        key: String,
        name: String,
        scopes: [String],
        lastUsed: String? = nil,
        expiresAt: String? = nil,
        createdAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.key = key
        self.name = name
        self.scopes = scopes
        self.lastUsed = lastUsed
        self.expiresAt = expiresAt
        self.createdAt = createdAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.key = try container.decode(String.self, forKey: .key)
        self.name = try container.decode(String.self, forKey: .name)
        self.scopes = try container.decode([String].self, forKey: .scopes)
        self.lastUsed = try container.decodeIfPresent(String.self, forKey: .lastUsed)
        self.expiresAt = try container.decodeIfPresent(String.self, forKey: .expiresAt)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.key, forKey: .key)
        try container.encode(self.name, forKey: .name)
        try container.encode(self.scopes, forKey: .scopes)
        try container.encodeIfPresent(self.lastUsed, forKey: .lastUsed)
        try container.encodeIfPresent(self.expiresAt, forKey: .expiresAt)
        try container.encode(self.createdAt, forKey: .createdAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case key
        case name
        case scopes
        case lastUsed
        case expiresAt
        case createdAt
    }
}