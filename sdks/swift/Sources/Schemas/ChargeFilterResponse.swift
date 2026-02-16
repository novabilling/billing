import Foundation

public struct ChargeFilterResponse: Codable, Hashable, Sendable {
    public let id: String
    public let chargeId: String
    public let key: String
    public let values: [String]
    public let properties: [String: JSONValue]?
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        chargeId: String,
        key: String,
        values: [String],
        properties: [String: JSONValue]? = nil,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.chargeId = chargeId
        self.key = key
        self.values = values
        self.properties = properties
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.chargeId = try container.decode(String.self, forKey: .chargeId)
        self.key = try container.decode(String.self, forKey: .key)
        self.values = try container.decode([String].self, forKey: .values)
        self.properties = try container.decodeIfPresent([String: JSONValue].self, forKey: .properties)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.chargeId, forKey: .chargeId)
        try container.encode(self.key, forKey: .key)
        try container.encode(self.values, forKey: .values)
        try container.encodeIfPresent(self.properties, forKey: .properties)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case chargeId
        case key
        case values
        case properties
    }
}