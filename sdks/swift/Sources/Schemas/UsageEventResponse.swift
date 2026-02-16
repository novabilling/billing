import Foundation

public struct UsageEventResponse: Codable, Hashable, Sendable {
    public let id: String
    public let transactionId: String
    public let subscriptionId: String
    public let code: String
    public let timestamp: String
    public let properties: [String: JSONValue]?
    public let createdAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        transactionId: String,
        subscriptionId: String,
        code: String,
        timestamp: String,
        properties: [String: JSONValue]? = nil,
        createdAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.transactionId = transactionId
        self.subscriptionId = subscriptionId
        self.code = code
        self.timestamp = timestamp
        self.properties = properties
        self.createdAt = createdAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.transactionId = try container.decode(String.self, forKey: .transactionId)
        self.subscriptionId = try container.decode(String.self, forKey: .subscriptionId)
        self.code = try container.decode(String.self, forKey: .code)
        self.timestamp = try container.decode(String.self, forKey: .timestamp)
        self.properties = try container.decodeIfPresent([String: JSONValue].self, forKey: .properties)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.transactionId, forKey: .transactionId)
        try container.encode(self.subscriptionId, forKey: .subscriptionId)
        try container.encode(self.code, forKey: .code)
        try container.encode(self.timestamp, forKey: .timestamp)
        try container.encodeIfPresent(self.properties, forKey: .properties)
        try container.encode(self.createdAt, forKey: .createdAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case transactionId
        case subscriptionId
        case code
        case timestamp
        case properties
        case createdAt
    }
}