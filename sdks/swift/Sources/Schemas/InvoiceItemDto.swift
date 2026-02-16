import Foundation

public struct InvoiceItemDto: Codable, Hashable, Sendable {
    public let description: String
    public let quantity: Double
    public let unitAmount: Double
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        description: String,
        quantity: Double,
        unitAmount: Double,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.description = description
        self.quantity = quantity
        self.unitAmount = unitAmount
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.description = try container.decode(String.self, forKey: .description)
        self.quantity = try container.decode(Double.self, forKey: .quantity)
        self.unitAmount = try container.decode(Double.self, forKey: .unitAmount)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.description, forKey: .description)
        try container.encode(self.quantity, forKey: .quantity)
        try container.encode(self.unitAmount, forKey: .unitAmount)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case description
        case quantity
        case unitAmount
    }
}