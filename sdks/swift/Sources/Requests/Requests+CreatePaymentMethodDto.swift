import Foundation

extension Requests {
    public struct CreatePaymentMethodDto: Codable, Hashable, Sendable {
        public let customerId: String
        /// Payment provider (stripe, paystack, flutterwave, dpo, payu, pesapal)
        public let provider: String
        public let type: CreatePaymentMethodDtoType?
        /// Provider-specific token/payment method ID
        public let tokenId: String
        public let last4: String?
        public let brand: String?
        public let expMonth: Double?
        public let expYear: Double?
        public let cardholderName: String?
        public let country: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            customerId: String,
            provider: String,
            type: CreatePaymentMethodDtoType? = nil,
            tokenId: String,
            last4: String? = nil,
            brand: String? = nil,
            expMonth: Double? = nil,
            expYear: Double? = nil,
            cardholderName: String? = nil,
            country: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.customerId = customerId
            self.provider = provider
            self.type = type
            self.tokenId = tokenId
            self.last4 = last4
            self.brand = brand
            self.expMonth = expMonth
            self.expYear = expYear
            self.cardholderName = cardholderName
            self.country = country
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.customerId = try container.decode(String.self, forKey: .customerId)
            self.provider = try container.decode(String.self, forKey: .provider)
            self.type = try container.decodeIfPresent(CreatePaymentMethodDtoType.self, forKey: .type)
            self.tokenId = try container.decode(String.self, forKey: .tokenId)
            self.last4 = try container.decodeIfPresent(String.self, forKey: .last4)
            self.brand = try container.decodeIfPresent(String.self, forKey: .brand)
            self.expMonth = try container.decodeIfPresent(Double.self, forKey: .expMonth)
            self.expYear = try container.decodeIfPresent(Double.self, forKey: .expYear)
            self.cardholderName = try container.decodeIfPresent(String.self, forKey: .cardholderName)
            self.country = try container.decodeIfPresent(String.self, forKey: .country)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.customerId, forKey: .customerId)
            try container.encode(self.provider, forKey: .provider)
            try container.encodeIfPresent(self.type, forKey: .type)
            try container.encode(self.tokenId, forKey: .tokenId)
            try container.encodeIfPresent(self.last4, forKey: .last4)
            try container.encodeIfPresent(self.brand, forKey: .brand)
            try container.encodeIfPresent(self.expMonth, forKey: .expMonth)
            try container.encodeIfPresent(self.expYear, forKey: .expYear)
            try container.encodeIfPresent(self.cardholderName, forKey: .cardholderName)
            try container.encodeIfPresent(self.country, forKey: .country)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case customerId
            case provider
            case type
            case tokenId
            case last4
            case brand
            case expMonth
            case expYear
            case cardholderName
            case country
        }
    }
}