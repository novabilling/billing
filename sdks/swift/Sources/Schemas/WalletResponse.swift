import Foundation

public struct WalletResponse: Codable, Hashable, Sendable {
    public let id: String
    public let customerId: String
    public let name: String?
    public let currency: String
    /// 1 credit = rateAmount in currency
    public let rateAmount: String
    /// Available credits
    public let creditsBalance: String
    /// Monetary equivalent of credits
    public let balance: String
    /// Lifetime consumed credits
    public let consumedCredits: String
    /// Lifetime consumed amount
    public let consumedAmount: String
    public let status: WalletResponseStatus
    public let expirationAt: String?
    public let terminatedAt: String?
    public let customer: WalletCustomerResponse?
    public let metadata: [String: JSONValue]?
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        customerId: String,
        name: String? = nil,
        currency: String,
        rateAmount: String,
        creditsBalance: String,
        balance: String,
        consumedCredits: String,
        consumedAmount: String,
        status: WalletResponseStatus,
        expirationAt: String? = nil,
        terminatedAt: String? = nil,
        customer: WalletCustomerResponse? = nil,
        metadata: [String: JSONValue]? = nil,
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.customerId = customerId
        self.name = name
        self.currency = currency
        self.rateAmount = rateAmount
        self.creditsBalance = creditsBalance
        self.balance = balance
        self.consumedCredits = consumedCredits
        self.consumedAmount = consumedAmount
        self.status = status
        self.expirationAt = expirationAt
        self.terminatedAt = terminatedAt
        self.customer = customer
        self.metadata = metadata
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.customerId = try container.decode(String.self, forKey: .customerId)
        self.name = try container.decodeIfPresent(String.self, forKey: .name)
        self.currency = try container.decode(String.self, forKey: .currency)
        self.rateAmount = try container.decode(String.self, forKey: .rateAmount)
        self.creditsBalance = try container.decode(String.self, forKey: .creditsBalance)
        self.balance = try container.decode(String.self, forKey: .balance)
        self.consumedCredits = try container.decode(String.self, forKey: .consumedCredits)
        self.consumedAmount = try container.decode(String.self, forKey: .consumedAmount)
        self.status = try container.decode(WalletResponseStatus.self, forKey: .status)
        self.expirationAt = try container.decodeIfPresent(String.self, forKey: .expirationAt)
        self.terminatedAt = try container.decodeIfPresent(String.self, forKey: .terminatedAt)
        self.customer = try container.decodeIfPresent(WalletCustomerResponse.self, forKey: .customer)
        self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.customerId, forKey: .customerId)
        try container.encodeIfPresent(self.name, forKey: .name)
        try container.encode(self.currency, forKey: .currency)
        try container.encode(self.rateAmount, forKey: .rateAmount)
        try container.encode(self.creditsBalance, forKey: .creditsBalance)
        try container.encode(self.balance, forKey: .balance)
        try container.encode(self.consumedCredits, forKey: .consumedCredits)
        try container.encode(self.consumedAmount, forKey: .consumedAmount)
        try container.encode(self.status, forKey: .status)
        try container.encodeIfPresent(self.expirationAt, forKey: .expirationAt)
        try container.encodeIfPresent(self.terminatedAt, forKey: .terminatedAt)
        try container.encodeIfPresent(self.customer, forKey: .customer)
        try container.encodeIfPresent(self.metadata, forKey: .metadata)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case customerId
        case name
        case currency
        case rateAmount
        case creditsBalance
        case balance
        case consumedCredits
        case consumedAmount
        case status
        case expirationAt
        case terminatedAt
        case customer
        case metadata
        case createdAt
        case updatedAt
    }
}