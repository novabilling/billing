import Foundation

public struct CreateEventDto: Codable, Hashable, Sendable {
    /// Unique transaction ID for idempotency
    public let transactionId: String
    /// Subscription ID or external subscription ID
    public let subscriptionId: String
    /// Billable metric code
    public let code: String
    /// Event timestamp (defaults to now)
    public let timestamp: String?
    /// Event properties
    public let properties: [String: JSONValue]?
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        transactionId: String,
        subscriptionId: String,
        code: String,
        timestamp: String? = nil,
        properties: [String: JSONValue]? = nil,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.transactionId = transactionId
        self.subscriptionId = subscriptionId
        self.code = code
        self.timestamp = timestamp
        self.properties = properties
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.transactionId = try container.decode(String.self, forKey: .transactionId)
        self.subscriptionId = try container.decode(String.self, forKey: .subscriptionId)
        self.code = try container.decode(String.self, forKey: .code)
        self.timestamp = try container.decodeIfPresent(String.self, forKey: .timestamp)
        self.properties = try container.decodeIfPresent([String: JSONValue].self, forKey: .properties)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.transactionId, forKey: .transactionId)
        try container.encode(self.subscriptionId, forKey: .subscriptionId)
        try container.encode(self.code, forKey: .code)
        try container.encodeIfPresent(self.timestamp, forKey: .timestamp)
        try container.encodeIfPresent(self.properties, forKey: .properties)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case transactionId
        case subscriptionId
        case code
        case timestamp
        case properties
    }
}