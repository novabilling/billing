import Foundation

extension Requests {
    public struct UpdatePlanOverrideDto: Codable, Hashable, Sendable {
        /// Override plan prices
        public let overriddenPrices: [String]?
        /// Override minimum commitment amount
        public let overriddenMinimumCommitment: Double?
        /// Override charge properties
        public let overriddenCharges: [String]?
        /// Custom metadata
        public let metadata: [String: JSONValue]?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            overriddenPrices: [String]? = nil,
            overriddenMinimumCommitment: Double? = nil,
            overriddenCharges: [String]? = nil,
            metadata: [String: JSONValue]? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.overriddenPrices = overriddenPrices
            self.overriddenMinimumCommitment = overriddenMinimumCommitment
            self.overriddenCharges = overriddenCharges
            self.metadata = metadata
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.overriddenPrices = try container.decodeIfPresent([String].self, forKey: .overriddenPrices)
            self.overriddenMinimumCommitment = try container.decodeIfPresent(Double.self, forKey: .overriddenMinimumCommitment)
            self.overriddenCharges = try container.decodeIfPresent([String].self, forKey: .overriddenCharges)
            self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encodeIfPresent(self.overriddenPrices, forKey: .overriddenPrices)
            try container.encodeIfPresent(self.overriddenMinimumCommitment, forKey: .overriddenMinimumCommitment)
            try container.encodeIfPresent(self.overriddenCharges, forKey: .overriddenCharges)
            try container.encodeIfPresent(self.metadata, forKey: .metadata)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case overriddenPrices
            case overriddenMinimumCommitment
            case overriddenCharges
            case metadata
        }
    }
}