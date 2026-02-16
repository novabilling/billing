import Foundation

public struct CreateBillableMetricFilterDto: Codable, Hashable, Sendable {
    /// Property key to filter on
    public let key: String
    /// Allowed values
    public let values: [String]
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        key: String,
        values: [String],
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.key = key
        self.values = values
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.key = try container.decode(String.self, forKey: .key)
        self.values = try container.decode([String].self, forKey: .values)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.key, forKey: .key)
        try container.encode(self.values, forKey: .values)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case key
        case values
    }
}