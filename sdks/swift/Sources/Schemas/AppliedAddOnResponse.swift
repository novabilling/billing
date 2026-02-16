import Foundation

public struct AppliedAddOnResponse: Codable, Hashable, Sendable {
    public let id: String
    public let addOnId: String
    public let customerId: String
    public let subscriptionId: String?
    public let amount: String
    public let currency: String
    public let invoiceId: String?
    public let createdAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        addOnId: String,
        customerId: String,
        subscriptionId: String? = nil,
        amount: String,
        currency: String,
        invoiceId: String? = nil,
        createdAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.addOnId = addOnId
        self.customerId = customerId
        self.subscriptionId = subscriptionId
        self.amount = amount
        self.currency = currency
        self.invoiceId = invoiceId
        self.createdAt = createdAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.addOnId = try container.decode(String.self, forKey: .addOnId)
        self.customerId = try container.decode(String.self, forKey: .customerId)
        self.subscriptionId = try container.decodeIfPresent(String.self, forKey: .subscriptionId)
        self.amount = try container.decode(String.self, forKey: .amount)
        self.currency = try container.decode(String.self, forKey: .currency)
        self.invoiceId = try container.decodeIfPresent(String.self, forKey: .invoiceId)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.addOnId, forKey: .addOnId)
        try container.encode(self.customerId, forKey: .customerId)
        try container.encodeIfPresent(self.subscriptionId, forKey: .subscriptionId)
        try container.encode(self.amount, forKey: .amount)
        try container.encode(self.currency, forKey: .currency)
        try container.encodeIfPresent(self.invoiceId, forKey: .invoiceId)
        try container.encode(self.createdAt, forKey: .createdAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case addOnId
        case customerId
        case subscriptionId
        case amount
        case currency
        case invoiceId
        case createdAt
    }
}