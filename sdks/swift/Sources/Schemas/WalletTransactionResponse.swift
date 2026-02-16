import Foundation

public struct WalletTransactionResponse: Codable, Hashable, Sendable {
    public let id: String
    public let walletId: String
    public let transactionType: WalletTransactionResponseTransactionType
    public let status: WalletTransactionResponseStatus
    public let transactionStatus: WalletTransactionResponseTransactionStatus
    /// Credits added or deducted
    public let creditAmount: String
    /// Monetary equivalent
    public let amount: String
    public let invoiceId: String?
    public let settledAt: String?
    public let metadata: [String: JSONValue]?
    public let createdAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        walletId: String,
        transactionType: WalletTransactionResponseTransactionType,
        status: WalletTransactionResponseStatus,
        transactionStatus: WalletTransactionResponseTransactionStatus,
        creditAmount: String,
        amount: String,
        invoiceId: String? = nil,
        settledAt: String? = nil,
        metadata: [String: JSONValue]? = nil,
        createdAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.walletId = walletId
        self.transactionType = transactionType
        self.status = status
        self.transactionStatus = transactionStatus
        self.creditAmount = creditAmount
        self.amount = amount
        self.invoiceId = invoiceId
        self.settledAt = settledAt
        self.metadata = metadata
        self.createdAt = createdAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.walletId = try container.decode(String.self, forKey: .walletId)
        self.transactionType = try container.decode(WalletTransactionResponseTransactionType.self, forKey: .transactionType)
        self.status = try container.decode(WalletTransactionResponseStatus.self, forKey: .status)
        self.transactionStatus = try container.decode(WalletTransactionResponseTransactionStatus.self, forKey: .transactionStatus)
        self.creditAmount = try container.decode(String.self, forKey: .creditAmount)
        self.amount = try container.decode(String.self, forKey: .amount)
        self.invoiceId = try container.decodeIfPresent(String.self, forKey: .invoiceId)
        self.settledAt = try container.decodeIfPresent(String.self, forKey: .settledAt)
        self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.walletId, forKey: .walletId)
        try container.encode(self.transactionType, forKey: .transactionType)
        try container.encode(self.status, forKey: .status)
        try container.encode(self.transactionStatus, forKey: .transactionStatus)
        try container.encode(self.creditAmount, forKey: .creditAmount)
        try container.encode(self.amount, forKey: .amount)
        try container.encodeIfPresent(self.invoiceId, forKey: .invoiceId)
        try container.encodeIfPresent(self.settledAt, forKey: .settledAt)
        try container.encodeIfPresent(self.metadata, forKey: .metadata)
        try container.encode(self.createdAt, forKey: .createdAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case walletId
        case transactionType
        case status
        case transactionStatus
        case creditAmount
        case amount
        case invoiceId
        case settledAt
        case metadata
        case createdAt
    }
}