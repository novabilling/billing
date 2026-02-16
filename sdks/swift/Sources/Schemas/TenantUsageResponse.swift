import Foundation

public struct TenantUsageResponse: Codable, Hashable, Sendable {
    public let customers: Double
    public let activeSubscriptions: Double
    public let totalInvoices: Double
    public let totalRevenue: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        customers: Double,
        activeSubscriptions: Double,
        totalInvoices: Double,
        totalRevenue: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.customers = customers
        self.activeSubscriptions = activeSubscriptions
        self.totalInvoices = totalInvoices
        self.totalRevenue = totalRevenue
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.customers = try container.decode(Double.self, forKey: .customers)
        self.activeSubscriptions = try container.decode(Double.self, forKey: .activeSubscriptions)
        self.totalInvoices = try container.decode(Double.self, forKey: .totalInvoices)
        self.totalRevenue = try container.decode(String.self, forKey: .totalRevenue)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.customers, forKey: .customers)
        try container.encode(self.activeSubscriptions, forKey: .activeSubscriptions)
        try container.encode(self.totalInvoices, forKey: .totalInvoices)
        try container.encode(self.totalRevenue, forKey: .totalRevenue)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case customers
        case activeSubscriptions
        case totalInvoices
        case totalRevenue
    }
}