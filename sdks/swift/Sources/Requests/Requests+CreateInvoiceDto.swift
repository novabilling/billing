import Foundation

extension Requests {
    public struct CreateInvoiceDto: Codable, Hashable, Sendable {
        /// Customer ID
        public let customerId: String
        /// Subscription ID (optional)
        public let subscriptionId: String?
        public let items: [InvoiceItemDto]
        /// Due date
        public let dueDate: String
        /// Override invoice status for imports
        public let status: CreateInvoiceDtoStatus?
        /// Override invoice number (e.g. INV-00042). Auto-generated if omitted.
        public let invoiceNumber: String?
        /// Currency override (defaults to customer currency)
        public let currency: String?
        /// Paid at date (ISO 8601). For importing paid invoices.
        public let paidAt: String?
        /// Backdate createdAt (ISO 8601). For data imports.
        public let createdAt: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            customerId: String,
            subscriptionId: String? = nil,
            items: [InvoiceItemDto],
            dueDate: String,
            status: CreateInvoiceDtoStatus? = nil,
            invoiceNumber: String? = nil,
            currency: String? = nil,
            paidAt: String? = nil,
            createdAt: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.customerId = customerId
            self.subscriptionId = subscriptionId
            self.items = items
            self.dueDate = dueDate
            self.status = status
            self.invoiceNumber = invoiceNumber
            self.currency = currency
            self.paidAt = paidAt
            self.createdAt = createdAt
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.customerId = try container.decode(String.self, forKey: .customerId)
            self.subscriptionId = try container.decodeIfPresent(String.self, forKey: .subscriptionId)
            self.items = try container.decode([InvoiceItemDto].self, forKey: .items)
            self.dueDate = try container.decode(String.self, forKey: .dueDate)
            self.status = try container.decodeIfPresent(CreateInvoiceDtoStatus.self, forKey: .status)
            self.invoiceNumber = try container.decodeIfPresent(String.self, forKey: .invoiceNumber)
            self.currency = try container.decodeIfPresent(String.self, forKey: .currency)
            self.paidAt = try container.decodeIfPresent(String.self, forKey: .paidAt)
            self.createdAt = try container.decodeIfPresent(String.self, forKey: .createdAt)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.customerId, forKey: .customerId)
            try container.encodeIfPresent(self.subscriptionId, forKey: .subscriptionId)
            try container.encode(self.items, forKey: .items)
            try container.encode(self.dueDate, forKey: .dueDate)
            try container.encodeIfPresent(self.status, forKey: .status)
            try container.encodeIfPresent(self.invoiceNumber, forKey: .invoiceNumber)
            try container.encodeIfPresent(self.currency, forKey: .currency)
            try container.encodeIfPresent(self.paidAt, forKey: .paidAt)
            try container.encodeIfPresent(self.createdAt, forKey: .createdAt)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case customerId
            case subscriptionId
            case items
            case dueDate
            case status
            case invoiceNumber
            case currency
            case paidAt
            case createdAt
        }
    }
}