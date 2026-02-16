import Foundation

extension Requests {
    public struct CreateBillableMetricDto: Codable, Hashable, Sendable {
        public let name: String
        /// Unique metric code
        public let code: String
        public let description: String?
        public let aggregationType: CreateBillableMetricDtoAggregationType
        /// Property key to aggregate (required for SUM, MAX, LATEST, WEIGHTED_SUM)
        public let fieldName: String?
        /// If true, value carries forward across billing periods
        public let recurring: Bool?
        public let filters: [CreateBillableMetricFilterDto]?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String,
            code: String,
            description: String? = nil,
            aggregationType: CreateBillableMetricDtoAggregationType,
            fieldName: String? = nil,
            recurring: Bool? = nil,
            filters: [CreateBillableMetricFilterDto]? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.code = code
            self.description = description
            self.aggregationType = aggregationType
            self.fieldName = fieldName
            self.recurring = recurring
            self.filters = filters
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decode(String.self, forKey: .name)
            self.code = try container.decode(String.self, forKey: .code)
            self.description = try container.decodeIfPresent(String.self, forKey: .description)
            self.aggregationType = try container.decode(CreateBillableMetricDtoAggregationType.self, forKey: .aggregationType)
            self.fieldName = try container.decodeIfPresent(String.self, forKey: .fieldName)
            self.recurring = try container.decodeIfPresent(Bool.self, forKey: .recurring)
            self.filters = try container.decodeIfPresent([CreateBillableMetricFilterDto].self, forKey: .filters)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.name, forKey: .name)
            try container.encode(self.code, forKey: .code)
            try container.encodeIfPresent(self.description, forKey: .description)
            try container.encode(self.aggregationType, forKey: .aggregationType)
            try container.encodeIfPresent(self.fieldName, forKey: .fieldName)
            try container.encodeIfPresent(self.recurring, forKey: .recurring)
            try container.encodeIfPresent(self.filters, forKey: .filters)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case code
            case description
            case aggregationType
            case fieldName
            case recurring
            case filters
        }
    }
}