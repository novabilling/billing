import Foundation

public struct ChargeFilterDto: Codable, Hashable, Sendable {
    /// Filter key (must match metric filter)
    public let key: String
    /// Subset of allowed values
    public let values: [String]
    /// Override properties for this filter
    public let properties: [String: JSONValue]?
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        key: String,
        values: [String],
        properties: [String: JSONValue]? = nil,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.key = key
        self.values = values
        self.properties = properties
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.key = try container.decode(String.self, forKey: .key)
        self.values = try container.decode([String].self, forKey: .values)
        self.properties = try container.decodeIfPresent([String: JSONValue].self, forKey: .properties)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.key, forKey: .key)
        try container.encode(self.values, forKey: .values)
        try container.encodeIfPresent(self.properties, forKey: .properties)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case key
        case values
        case properties
    }
}