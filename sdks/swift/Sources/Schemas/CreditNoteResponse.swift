import Foundation

public struct CreditNoteResponse: Codable, Hashable, Sendable {
    public let id: String
    public let invoiceId: String
    public let customerId: String
    /// Decimal amount as string
    public let amount: String
    public let currency: String
    public let reason: CreditNoteResponseReason
    public let status: CreditNoteResponseStatus
    public let metadata: [String: JSONValue]?
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        invoiceId: String,
        customerId: String,
        amount: String,
        currency: String,
        reason: CreditNoteResponseReason,
        status: CreditNoteResponseStatus,
        metadata: [String: JSONValue]? = nil,
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.invoiceId = invoiceId
        self.customerId = customerId
        self.amount = amount
        self.currency = currency
        self.reason = reason
        self.status = status
        self.metadata = metadata
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.invoiceId = try container.decode(String.self, forKey: .invoiceId)
        self.customerId = try container.decode(String.self, forKey: .customerId)
        self.amount = try container.decode(String.self, forKey: .amount)
        self.currency = try container.decode(String.self, forKey: .currency)
        self.reason = try container.decode(CreditNoteResponseReason.self, forKey: .reason)
        self.status = try container.decode(CreditNoteResponseStatus.self, forKey: .status)
        self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.invoiceId, forKey: .invoiceId)
        try container.encode(self.customerId, forKey: .customerId)
        try container.encode(self.amount, forKey: .amount)
        try container.encode(self.currency, forKey: .currency)
        try container.encode(self.reason, forKey: .reason)
        try container.encode(self.status, forKey: .status)
        try container.encodeIfPresent(self.metadata, forKey: .metadata)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case invoiceId
        case customerId
        case amount
        case currency
        case reason
        case status
        case metadata
        case createdAt
        case updatedAt
    }
}