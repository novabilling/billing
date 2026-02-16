import Foundation

public struct BillableMetricResponse: Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let code: String
    public let description: String?
    public let aggregationType: BillableMetricResponseAggregationType
    public let fieldName: String?
    public let recurring: Bool
    public let filters: [BillableMetricFilterResponse]
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        name: String,
        code: String,
        description: String? = nil,
        aggregationType: BillableMetricResponseAggregationType,
        fieldName: String? = nil,
        recurring: Bool,
        filters: [BillableMetricFilterResponse],
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.name = name
        self.code = code
        self.description = description
        self.aggregationType = aggregationType
        self.fieldName = fieldName
        self.recurring = recurring
        self.filters = filters
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.name = try container.decode(String.self, forKey: .name)
        self.code = try container.decode(String.self, forKey: .code)
        self.description = try container.decodeIfPresent(String.self, forKey: .description)
        self.aggregationType = try container.decode(BillableMetricResponseAggregationType.self, forKey: .aggregationType)
        self.fieldName = try container.decodeIfPresent(String.self, forKey: .fieldName)
        self.recurring = try container.decode(Bool.self, forKey: .recurring)
        self.filters = try container.decode([BillableMetricFilterResponse].self, forKey: .filters)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.name, forKey: .name)
        try container.encode(self.code, forKey: .code)
        try container.encodeIfPresent(self.description, forKey: .description)
        try container.encode(self.aggregationType, forKey: .aggregationType)
        try container.encodeIfPresent(self.fieldName, forKey: .fieldName)
        try container.encode(self.recurring, forKey: .recurring)
        try container.encode(self.filters, forKey: .filters)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case name
        case code
        case description
        case aggregationType
        case fieldName
        case recurring
        case filters
        case createdAt
        case updatedAt
    }
}