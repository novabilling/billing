import Foundation

extension Requests {
    public struct CreatePaymentDto: Codable, Hashable, Sendable {
        /// Invoice ID this payment is for
        public let invoiceId: String
        /// Payment provider name (e.g. stripe, paystack, manual)
        public let provider: String
        /// Payment amount
        public let amount: Double
        /// Currency
        public let currency: String
        /// Payment status
        public let status: CreatePaymentDtoStatus
        /// Provider transaction ID
        public let providerTransactionId: String?
        /// Failure reason (for FAILED payments)
        public let failureReason: String?
        /// Backdate createdAt (ISO 8601). For data imports.
        public let createdAt: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            invoiceId: String,
            provider: String,
            amount: Double,
            currency: String,
            status: CreatePaymentDtoStatus,
            providerTransactionId: String? = nil,
            failureReason: String? = nil,
            createdAt: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.invoiceId = invoiceId
            self.provider = provider
            self.amount = amount
            self.currency = currency
            self.status = status
            self.providerTransactionId = providerTransactionId
            self.failureReason = failureReason
            self.createdAt = createdAt
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.invoiceId = try container.decode(String.self, forKey: .invoiceId)
            self.provider = try container.decode(String.self, forKey: .provider)
            self.amount = try container.decode(Double.self, forKey: .amount)
            self.currency = try container.decode(String.self, forKey: .currency)
            self.status = try container.decode(CreatePaymentDtoStatus.self, forKey: .status)
            self.providerTransactionId = try container.decodeIfPresent(String.self, forKey: .providerTransactionId)
            self.failureReason = try container.decodeIfPresent(String.self, forKey: .failureReason)
            self.createdAt = try container.decodeIfPresent(String.self, forKey: .createdAt)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.invoiceId, forKey: .invoiceId)
            try container.encode(self.provider, forKey: .provider)
            try container.encode(self.amount, forKey: .amount)
            try container.encode(self.currency, forKey: .currency)
            try container.encode(self.status, forKey: .status)
            try container.encodeIfPresent(self.providerTransactionId, forKey: .providerTransactionId)
            try container.encodeIfPresent(self.failureReason, forKey: .failureReason)
            try container.encodeIfPresent(self.createdAt, forKey: .createdAt)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case invoiceId
            case provider
            case amount
            case currency
            case status
            case providerTransactionId
            case failureReason
            case createdAt
        }
    }
}