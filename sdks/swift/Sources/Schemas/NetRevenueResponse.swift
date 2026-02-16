import Foundation

public struct NetRevenueResponse: Codable, Hashable, Sendable {
    public let grossRevenue: Double
    public let refunds: Double
    public let creditNotes: Double
    public let netRevenue: Double
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        grossRevenue: Double,
        refunds: Double,
        creditNotes: Double,
        netRevenue: Double,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.grossRevenue = grossRevenue
        self.refunds = refunds
        self.creditNotes = creditNotes
        self.netRevenue = netRevenue
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.grossRevenue = try container.decode(Double.self, forKey: .grossRevenue)
        self.refunds = try container.decode(Double.self, forKey: .refunds)
        self.creditNotes = try container.decode(Double.self, forKey: .creditNotes)
        self.netRevenue = try container.decode(Double.self, forKey: .netRevenue)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.grossRevenue, forKey: .grossRevenue)
        try container.encode(self.refunds, forKey: .refunds)
        try container.encode(self.creditNotes, forKey: .creditNotes)
        try container.encode(self.netRevenue, forKey: .netRevenue)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case grossRevenue
        case refunds
        case creditNotes
        case netRevenue
    }
}