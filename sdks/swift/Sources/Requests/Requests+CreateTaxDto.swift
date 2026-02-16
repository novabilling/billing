import Foundation

extension Requests {
    public struct CreateTaxDto: Codable, Hashable, Sendable {
        /// Tax name
        public let name: String
        /// Unique tax code (lowercase, underscores)
        public let code: String
        /// Tax rate as a percentage (e.g., 18 for 18%)
        public let rate: Double
        /// Tax description
        public let description: String?
        /// Whether this tax is applied by default to all invoices
        public let appliedByDefault: Bool?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String,
            code: String,
            rate: Double,
            description: String? = nil,
            appliedByDefault: Bool? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.code = code
            self.rate = rate
            self.description = description
            self.appliedByDefault = appliedByDefault
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decode(String.self, forKey: .name)
            self.code = try container.decode(String.self, forKey: .code)
            self.rate = try container.decode(Double.self, forKey: .rate)
            self.description = try container.decodeIfPresent(String.self, forKey: .description)
            self.appliedByDefault = try container.decodeIfPresent(Bool.self, forKey: .appliedByDefault)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.name, forKey: .name)
            try container.encode(self.code, forKey: .code)
            try container.encode(self.rate, forKey: .rate)
            try container.encodeIfPresent(self.description, forKey: .description)
            try container.encodeIfPresent(self.appliedByDefault, forKey: .appliedByDefault)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case code
            case rate
            case description
            case appliedByDefault
        }
    }
}