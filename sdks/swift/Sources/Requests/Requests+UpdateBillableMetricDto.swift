import Foundation

extension Requests {
    public struct UpdateBillableMetricDto: Codable, Hashable, Sendable {
        public let name: String?
        public let description: String?
        public let fieldName: String?
        public let recurring: Bool?
        public let filters: [CreateBillableMetricFilterDto]?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String? = nil,
            description: String? = nil,
            fieldName: String? = nil,
            recurring: Bool? = nil,
            filters: [CreateBillableMetricFilterDto]? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.description = description
            self.fieldName = fieldName
            self.recurring = recurring
            self.filters = filters
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decodeIfPresent(String.self, forKey: .name)
            self.description = try container.decodeIfPresent(String.self, forKey: .description)
            self.fieldName = try container.decodeIfPresent(String.self, forKey: .fieldName)
            self.recurring = try container.decodeIfPresent(Bool.self, forKey: .recurring)
            self.filters = try container.decodeIfPresent([CreateBillableMetricFilterDto].self, forKey: .filters)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encodeIfPresent(self.name, forKey: .name)
            try container.encodeIfPresent(self.description, forKey: .description)
            try container.encodeIfPresent(self.fieldName, forKey: .fieldName)
            try container.encodeIfPresent(self.recurring, forKey: .recurring)
            try container.encodeIfPresent(self.filters, forKey: .filters)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case description
            case fieldName
            case recurring
            case filters
        }
    }
}