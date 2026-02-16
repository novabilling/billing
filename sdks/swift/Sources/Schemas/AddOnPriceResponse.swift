import Foundation

public struct AddOnPriceResponse: Codable, Hashable, Sendable {
    public let id: String
    public let addOnId: String
    public let currency: String
    /// Decimal amount as string
    public let amount: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        addOnId: String,
        currency: String,
        amount: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.addOnId = addOnId
        self.currency = currency
        self.amount = amount
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.addOnId = try container.decode(String.self, forKey: .addOnId)
        self.currency = try container.decode(String.self, forKey: .currency)
        self.amount = try container.decode(String.self, forKey: .amount)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.addOnId, forKey: .addOnId)
        try container.encode(self.currency, forKey: .currency)
        try container.encode(self.amount, forKey: .amount)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case addOnId
        case currency
        case amount
    }
}