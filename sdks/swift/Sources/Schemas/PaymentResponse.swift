import Foundation

public struct PaymentResponse: Codable, Hashable, Sendable {
    public let id: String
    public let invoiceId: String
    public let provider: String
    public let providerTransactionId: String?
    /// Decimal amount as string
    public let amount: String
    public let currency: String
    public let status: PaymentResponseStatus
    public let failureReason: String?
    public let metadata: [String: JSONValue]?
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        invoiceId: String,
        provider: String,
        providerTransactionId: String? = nil,
        amount: String,
        currency: String,
        status: PaymentResponseStatus,
        failureReason: String? = nil,
        metadata: [String: JSONValue]? = nil,
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.invoiceId = invoiceId
        self.provider = provider
        self.providerTransactionId = providerTransactionId
        self.amount = amount
        self.currency = currency
        self.status = status
        self.failureReason = failureReason
        self.metadata = metadata
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.invoiceId = try container.decode(String.self, forKey: .invoiceId)
        self.provider = try container.decode(String.self, forKey: .provider)
        self.providerTransactionId = try container.decodeIfPresent(String.self, forKey: .providerTransactionId)
        self.amount = try container.decode(String.self, forKey: .amount)
        self.currency = try container.decode(String.self, forKey: .currency)
        self.status = try container.decode(PaymentResponseStatus.self, forKey: .status)
        self.failureReason = try container.decodeIfPresent(String.self, forKey: .failureReason)
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
        try container.encode(self.provider, forKey: .provider)
        try container.encodeIfPresent(self.providerTransactionId, forKey: .providerTransactionId)
        try container.encode(self.amount, forKey: .amount)
        try container.encode(self.currency, forKey: .currency)
        try container.encode(self.status, forKey: .status)
        try container.encodeIfPresent(self.failureReason, forKey: .failureReason)
        try container.encodeIfPresent(self.metadata, forKey: .metadata)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case invoiceId
        case provider
        case providerTransactionId
        case amount
        case currency
        case status
        case failureReason
        case metadata
        case createdAt
        case updatedAt
    }
}