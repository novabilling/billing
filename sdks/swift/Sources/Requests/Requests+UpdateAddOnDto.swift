import Foundation

extension Requests {
    public struct UpdateAddOnDto: Codable, Hashable, Sendable {
        public let name: String?
        public let description: String?
        public let invoiceDisplayName: String?
        public let prices: [AddOnPriceDto]?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String? = nil,
            description: String? = nil,
            invoiceDisplayName: String? = nil,
            prices: [AddOnPriceDto]? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.description = description
            self.invoiceDisplayName = invoiceDisplayName
            self.prices = prices
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decodeIfPresent(String.self, forKey: .name)
            self.description = try container.decodeIfPresent(String.self, forKey: .description)
            self.invoiceDisplayName = try container.decodeIfPresent(String.self, forKey: .invoiceDisplayName)
            self.prices = try container.decodeIfPresent([AddOnPriceDto].self, forKey: .prices)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encodeIfPresent(self.name, forKey: .name)
            try container.encodeIfPresent(self.description, forKey: .description)
            try container.encodeIfPresent(self.invoiceDisplayName, forKey: .invoiceDisplayName)
            try container.encodeIfPresent(self.prices, forKey: .prices)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case description
            case invoiceDisplayName
            case prices
        }
    }
}