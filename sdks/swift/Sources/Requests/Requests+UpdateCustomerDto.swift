import Foundation

extension Requests {
    public struct UpdateCustomerDto: Codable, Hashable, Sendable {
        /// Tenant's user ID
        public let externalId: String?
        public let email: String?
        public let name: String?
        public let country: String?
        /// ISO currency code
        public let currency: String?
        /// Custom metadata
        public let metadata: [String: JSONValue]?
        /// Net payment terms in days (overrides org and plan defaults)
        public let netPaymentTerms: Double?
        /// Backdate createdAt (ISO 8601). For data imports.
        public let createdAt: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            externalId: String? = nil,
            email: String? = nil,
            name: String? = nil,
            country: String? = nil,
            currency: String? = nil,
            metadata: [String: JSONValue]? = nil,
            netPaymentTerms: Double? = nil,
            createdAt: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.externalId = externalId
            self.email = email
            self.name = name
            self.country = country
            self.currency = currency
            self.metadata = metadata
            self.netPaymentTerms = netPaymentTerms
            self.createdAt = createdAt
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.externalId = try container.decodeIfPresent(String.self, forKey: .externalId)
            self.email = try container.decodeIfPresent(String.self, forKey: .email)
            self.name = try container.decodeIfPresent(String.self, forKey: .name)
            self.country = try container.decodeIfPresent(String.self, forKey: .country)
            self.currency = try container.decodeIfPresent(String.self, forKey: .currency)
            self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
            self.netPaymentTerms = try container.decodeIfPresent(Double.self, forKey: .netPaymentTerms)
            self.createdAt = try container.decodeIfPresent(String.self, forKey: .createdAt)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encodeIfPresent(self.externalId, forKey: .externalId)
            try container.encodeIfPresent(self.email, forKey: .email)
            try container.encodeIfPresent(self.name, forKey: .name)
            try container.encodeIfPresent(self.country, forKey: .country)
            try container.encodeIfPresent(self.currency, forKey: .currency)
            try container.encodeIfPresent(self.metadata, forKey: .metadata)
            try container.encodeIfPresent(self.netPaymentTerms, forKey: .netPaymentTerms)
            try container.encodeIfPresent(self.createdAt, forKey: .createdAt)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case externalId
            case email
            case name
            case country
            case currency
            case metadata
            case netPaymentTerms
            case createdAt
        }
    }
}