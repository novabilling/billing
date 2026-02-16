import Foundation

public struct InvoiceResponse: Codable, Hashable, Sendable {
    public let id: String
    public let invoiceNumber: String
    public let subscriptionId: String?
    public let customerId: String
    /// Decimal amount as string
    public let amount: String
    public let currency: String
    public let status: InvoiceResponseStatus
    public let dueDate: String
    public let paidAt: String?
    public let pdfUrl: String?
    /// Line items, plan info, discounts
    public let metadata: [String: JSONValue]?
    public let customer: InvoiceCustomerResponse?
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        invoiceNumber: String,
        subscriptionId: String? = nil,
        customerId: String,
        amount: String,
        currency: String,
        status: InvoiceResponseStatus,
        dueDate: String,
        paidAt: String? = nil,
        pdfUrl: String? = nil,
        metadata: [String: JSONValue]? = nil,
        customer: InvoiceCustomerResponse? = nil,
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.invoiceNumber = invoiceNumber
        self.subscriptionId = subscriptionId
        self.customerId = customerId
        self.amount = amount
        self.currency = currency
        self.status = status
        self.dueDate = dueDate
        self.paidAt = paidAt
        self.pdfUrl = pdfUrl
        self.metadata = metadata
        self.customer = customer
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.invoiceNumber = try container.decode(String.self, forKey: .invoiceNumber)
        self.subscriptionId = try container.decodeIfPresent(String.self, forKey: .subscriptionId)
        self.customerId = try container.decode(String.self, forKey: .customerId)
        self.amount = try container.decode(String.self, forKey: .amount)
        self.currency = try container.decode(String.self, forKey: .currency)
        self.status = try container.decode(InvoiceResponseStatus.self, forKey: .status)
        self.dueDate = try container.decode(String.self, forKey: .dueDate)
        self.paidAt = try container.decodeIfPresent(String.self, forKey: .paidAt)
        self.pdfUrl = try container.decodeIfPresent(String.self, forKey: .pdfUrl)
        self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
        self.customer = try container.decodeIfPresent(InvoiceCustomerResponse.self, forKey: .customer)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.invoiceNumber, forKey: .invoiceNumber)
        try container.encodeIfPresent(self.subscriptionId, forKey: .subscriptionId)
        try container.encode(self.customerId, forKey: .customerId)
        try container.encode(self.amount, forKey: .amount)
        try container.encode(self.currency, forKey: .currency)
        try container.encode(self.status, forKey: .status)
        try container.encode(self.dueDate, forKey: .dueDate)
        try container.encodeIfPresent(self.paidAt, forKey: .paidAt)
        try container.encodeIfPresent(self.pdfUrl, forKey: .pdfUrl)
        try container.encodeIfPresent(self.metadata, forKey: .metadata)
        try container.encodeIfPresent(self.customer, forKey: .customer)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case invoiceNumber
        case subscriptionId
        case customerId
        case amount
        case currency
        case status
        case dueDate
        case paidAt
        case pdfUrl
        case metadata
        case customer
        case createdAt
        case updatedAt
    }
}