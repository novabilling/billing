import Foundation

extension Requests {
    public struct CreateCreditNoteDto: Codable, Hashable, Sendable {
        /// Invoice ID to credit against
        public let invoiceId: String
        /// Customer ID
        public let customerId: String
        /// Credit amount
        public let amount: Double
        /// Currency
        public let currency: String
        public let reason: CreateCreditNoteDtoReason
        /// Additional metadata
        public let metadata: [String: JSONValue]?
        /// Override status for imports
        public let status: CreateCreditNoteDtoStatus?
        /// Backdate createdAt (ISO 8601). For data imports.
        public let createdAt: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            invoiceId: String,
            customerId: String,
            amount: Double,
            currency: String,
            reason: CreateCreditNoteDtoReason,
            metadata: [String: JSONValue]? = nil,
            status: CreateCreditNoteDtoStatus? = nil,
            createdAt: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.invoiceId = invoiceId
            self.customerId = customerId
            self.amount = amount
            self.currency = currency
            self.reason = reason
            self.metadata = metadata
            self.status = status
            self.createdAt = createdAt
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.invoiceId = try container.decode(String.self, forKey: .invoiceId)
            self.customerId = try container.decode(String.self, forKey: .customerId)
            self.amount = try container.decode(Double.self, forKey: .amount)
            self.currency = try container.decode(String.self, forKey: .currency)
            self.reason = try container.decode(CreateCreditNoteDtoReason.self, forKey: .reason)
            self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
            self.status = try container.decodeIfPresent(CreateCreditNoteDtoStatus.self, forKey: .status)
            self.createdAt = try container.decodeIfPresent(String.self, forKey: .createdAt)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.invoiceId, forKey: .invoiceId)
            try container.encode(self.customerId, forKey: .customerId)
            try container.encode(self.amount, forKey: .amount)
            try container.encode(self.currency, forKey: .currency)
            try container.encode(self.reason, forKey: .reason)
            try container.encodeIfPresent(self.metadata, forKey: .metadata)
            try container.encodeIfPresent(self.status, forKey: .status)
            try container.encodeIfPresent(self.createdAt, forKey: .createdAt)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case invoiceId
            case customerId
            case amount
            case currency
            case reason
            case metadata
            case status
            case createdAt
        }
    }
}