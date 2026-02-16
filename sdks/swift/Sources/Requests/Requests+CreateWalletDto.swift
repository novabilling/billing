import Foundation

extension Requests {
    public struct CreateWalletDto: Codable, Hashable, Sendable {
        public let customerId: String
        public let name: String?
        public let currency: String
        /// 1 credit = rateAmount in currency
        public let rateAmount: Double?
        /// Paid credits (purchase)
        public let paidCredits: Double?
        /// Free credits (grant)
        public let grantedCredits: Double?
        /// Expiration date (ISO 8601)
        public let expirationAt: String?
        public let metadata: [String: JSONValue]?
        /// Backdate createdAt (ISO 8601). For data imports.
        public let createdAt: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            customerId: String,
            name: String? = nil,
            currency: String,
            rateAmount: Double? = nil,
            paidCredits: Double? = nil,
            grantedCredits: Double? = nil,
            expirationAt: String? = nil,
            metadata: [String: JSONValue]? = nil,
            createdAt: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.customerId = customerId
            self.name = name
            self.currency = currency
            self.rateAmount = rateAmount
            self.paidCredits = paidCredits
            self.grantedCredits = grantedCredits
            self.expirationAt = expirationAt
            self.metadata = metadata
            self.createdAt = createdAt
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.customerId = try container.decode(String.self, forKey: .customerId)
            self.name = try container.decodeIfPresent(String.self, forKey: .name)
            self.currency = try container.decode(String.self, forKey: .currency)
            self.rateAmount = try container.decodeIfPresent(Double.self, forKey: .rateAmount)
            self.paidCredits = try container.decodeIfPresent(Double.self, forKey: .paidCredits)
            self.grantedCredits = try container.decodeIfPresent(Double.self, forKey: .grantedCredits)
            self.expirationAt = try container.decodeIfPresent(String.self, forKey: .expirationAt)
            self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
            self.createdAt = try container.decodeIfPresent(String.self, forKey: .createdAt)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.customerId, forKey: .customerId)
            try container.encodeIfPresent(self.name, forKey: .name)
            try container.encode(self.currency, forKey: .currency)
            try container.encodeIfPresent(self.rateAmount, forKey: .rateAmount)
            try container.encodeIfPresent(self.paidCredits, forKey: .paidCredits)
            try container.encodeIfPresent(self.grantedCredits, forKey: .grantedCredits)
            try container.encodeIfPresent(self.expirationAt, forKey: .expirationAt)
            try container.encodeIfPresent(self.metadata, forKey: .metadata)
            try container.encodeIfPresent(self.createdAt, forKey: .createdAt)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case customerId
            case name
            case currency
            case rateAmount
            case paidCredits
            case grantedCredits
            case expirationAt
            case metadata
            case createdAt
        }
    }
}