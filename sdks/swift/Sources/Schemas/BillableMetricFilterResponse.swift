import Foundation

public struct BillableMetricFilterResponse: Codable, Hashable, Sendable {
    public let id: String
    public let billableMetricId: String
    public let key: String
    public let values: [String]
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        billableMetricId: String,
        key: String,
        values: [String],
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.billableMetricId = billableMetricId
        self.key = key
        self.values = values
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.billableMetricId = try container.decode(String.self, forKey: .billableMetricId)
        self.key = try container.decode(String.self, forKey: .key)
        self.values = try container.decode([String].self, forKey: .values)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.billableMetricId, forKey: .billableMetricId)
        try container.encode(self.key, forKey: .key)
        try container.encode(self.values, forKey: .values)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case billableMetricId
        case key
        case values
    }
}