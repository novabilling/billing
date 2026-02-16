import Foundation

extension Requests {
    public struct UpdateTaxDto: Codable, Hashable, Sendable {
        public let name: String?
        public let rate: Double?
        public let description: String?
        public let appliedByDefault: Bool?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String? = nil,
            rate: Double? = nil,
            description: String? = nil,
            appliedByDefault: Bool? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.rate = rate
            self.description = description
            self.appliedByDefault = appliedByDefault
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decodeIfPresent(String.self, forKey: .name)
            self.rate = try container.decodeIfPresent(Double.self, forKey: .rate)
            self.description = try container.decodeIfPresent(String.self, forKey: .description)
            self.appliedByDefault = try container.decodeIfPresent(Bool.self, forKey: .appliedByDefault)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encodeIfPresent(self.name, forKey: .name)
            try container.encodeIfPresent(self.rate, forKey: .rate)
            try container.encodeIfPresent(self.description, forKey: .description)
            try container.encodeIfPresent(self.appliedByDefault, forKey: .appliedByDefault)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case rate
            case description
            case appliedByDefault
        }
    }
}