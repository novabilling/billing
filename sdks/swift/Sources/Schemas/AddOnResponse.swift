import Foundation

public struct AddOnResponse: Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let code: String
    public let description: String?
    public let invoiceDisplayName: String?
    public let prices: [AddOnPriceResponse]
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        name: String,
        code: String,
        description: String? = nil,
        invoiceDisplayName: String? = nil,
        prices: [AddOnPriceResponse],
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.name = name
        self.code = code
        self.description = description
        self.invoiceDisplayName = invoiceDisplayName
        self.prices = prices
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.name = try container.decode(String.self, forKey: .name)
        self.code = try container.decode(String.self, forKey: .code)
        self.description = try container.decodeIfPresent(String.self, forKey: .description)
        self.invoiceDisplayName = try container.decodeIfPresent(String.self, forKey: .invoiceDisplayName)
        self.prices = try container.decode([AddOnPriceResponse].self, forKey: .prices)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.name, forKey: .name)
        try container.encode(self.code, forKey: .code)
        try container.encodeIfPresent(self.description, forKey: .description)
        try container.encodeIfPresent(self.invoiceDisplayName, forKey: .invoiceDisplayName)
        try container.encode(self.prices, forKey: .prices)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case name
        case code
        case description
        case invoiceDisplayName
        case prices
        case createdAt
        case updatedAt
    }
}