import Foundation

public struct RevenueAnalyticsResponse: Codable, Hashable, Sendable {
    /// Total revenue as decimal string
    public let totalRevenue: String
    public let invoiceCount: Double
    /// Monthly recurring revenue
    public let mrr: String
    /// Annual recurring revenue
    public let arr: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        totalRevenue: String,
        invoiceCount: Double,
        mrr: String,
        arr: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.totalRevenue = totalRevenue
        self.invoiceCount = invoiceCount
        self.mrr = mrr
        self.arr = arr
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.totalRevenue = try container.decode(String.self, forKey: .totalRevenue)
        self.invoiceCount = try container.decode(Double.self, forKey: .invoiceCount)
        self.mrr = try container.decode(String.self, forKey: .mrr)
        self.arr = try container.decode(String.self, forKey: .arr)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.totalRevenue, forKey: .totalRevenue)
        try container.encode(self.invoiceCount, forKey: .invoiceCount)
        try container.encode(self.mrr, forKey: .mrr)
        try container.encode(self.arr, forKey: .arr)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case totalRevenue
        case invoiceCount
        case mrr
        case arr
    }
}