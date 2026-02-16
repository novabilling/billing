import Foundation

extension Requests {
    public struct CreateAddOnDto: Codable, Hashable, Sendable {
        /// Display name
        public let name: String
        /// Unique code for the add-on
        public let code: String
        public let description: String?
        /// Custom name shown on invoices
        public let invoiceDisplayName: String?
        /// Prices in different currencies
        public let prices: [AddOnPriceDto]
        /// Backdate createdAt (ISO 8601). For data imports.
        public let createdAt: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String,
            code: String,
            description: String? = nil,
            invoiceDisplayName: String? = nil,
            prices: [AddOnPriceDto],
            createdAt: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.code = code
            self.description = description
            self.invoiceDisplayName = invoiceDisplayName
            self.prices = prices
            self.createdAt = createdAt
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decode(String.self, forKey: .name)
            self.code = try container.decode(String.self, forKey: .code)
            self.description = try container.decodeIfPresent(String.self, forKey: .description)
            self.invoiceDisplayName = try container.decodeIfPresent(String.self, forKey: .invoiceDisplayName)
            self.prices = try container.decode([AddOnPriceDto].self, forKey: .prices)
            self.createdAt = try container.decodeIfPresent(String.self, forKey: .createdAt)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.name, forKey: .name)
            try container.encode(self.code, forKey: .code)
            try container.encodeIfPresent(self.description, forKey: .description)
            try container.encodeIfPresent(self.invoiceDisplayName, forKey: .invoiceDisplayName)
            try container.encode(self.prices, forKey: .prices)
            try container.encodeIfPresent(self.createdAt, forKey: .createdAt)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case code
            case description
            case invoiceDisplayName
            case prices
            case createdAt
        }
    }
}