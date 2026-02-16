import Foundation

public struct TenantInfoResponse: Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let slug: String
    public let email: String
    public let apiKey: String
    public let webhookUrl: String?
    public let webhookSecret: String?
    public let isActive: Bool
    public let settings: [String: JSONValue]?
    public let lastLoginAt: String?
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        name: String,
        slug: String,
        email: String,
        apiKey: String,
        webhookUrl: String? = nil,
        webhookSecret: String? = nil,
        isActive: Bool,
        settings: [String: JSONValue]? = nil,
        lastLoginAt: String? = nil,
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.name = name
        self.slug = slug
        self.email = email
        self.apiKey = apiKey
        self.webhookUrl = webhookUrl
        self.webhookSecret = webhookSecret
        self.isActive = isActive
        self.settings = settings
        self.lastLoginAt = lastLoginAt
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.name = try container.decode(String.self, forKey: .name)
        self.slug = try container.decode(String.self, forKey: .slug)
        self.email = try container.decode(String.self, forKey: .email)
        self.apiKey = try container.decode(String.self, forKey: .apiKey)
        self.webhookUrl = try container.decodeIfPresent(String.self, forKey: .webhookUrl)
        self.webhookSecret = try container.decodeIfPresent(String.self, forKey: .webhookSecret)
        self.isActive = try container.decode(Bool.self, forKey: .isActive)
        self.settings = try container.decodeIfPresent([String: JSONValue].self, forKey: .settings)
        self.lastLoginAt = try container.decodeIfPresent(String.self, forKey: .lastLoginAt)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.name, forKey: .name)
        try container.encode(self.slug, forKey: .slug)
        try container.encode(self.email, forKey: .email)
        try container.encode(self.apiKey, forKey: .apiKey)
        try container.encodeIfPresent(self.webhookUrl, forKey: .webhookUrl)
        try container.encodeIfPresent(self.webhookSecret, forKey: .webhookSecret)
        try container.encode(self.isActive, forKey: .isActive)
        try container.encodeIfPresent(self.settings, forKey: .settings)
        try container.encodeIfPresent(self.lastLoginAt, forKey: .lastLoginAt)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case name
        case slug
        case email
        case apiKey
        case webhookUrl
        case webhookSecret
        case isActive
        case settings
        case lastLoginAt
        case createdAt
        case updatedAt
    }
}