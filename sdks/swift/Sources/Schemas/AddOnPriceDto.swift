import Foundation

public struct AddOnPriceDto: Codable, Hashable, Sendable {
    /// ISO 4217 currency code
    public let currency: String
    /// Price amount
    public let amount: Double
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        currency: String,
        amount: Double,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.currency = currency
        self.amount = amount
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.currency = try container.decode(String.self, forKey: .currency)
        self.amount = try container.decode(Double.self, forKey: .amount)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.currency, forKey: .currency)
        try container.encode(self.amount, forKey: .amount)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case currency
        case amount
    }
}