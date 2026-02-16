import Foundation

public struct CustomerAnalyticsResponse: Codable, Hashable, Sendable {
    public let totalCustomers: Double
    public let newCustomers: Double
    /// Average revenue per user
    public let arpu: String
    public let totalRevenue: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        totalCustomers: Double,
        newCustomers: Double,
        arpu: String,
        totalRevenue: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.totalCustomers = totalCustomers
        self.newCustomers = newCustomers
        self.arpu = arpu
        self.totalRevenue = totalRevenue
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.totalCustomers = try container.decode(Double.self, forKey: .totalCustomers)
        self.newCustomers = try container.decode(Double.self, forKey: .newCustomers)
        self.arpu = try container.decode(String.self, forKey: .arpu)
        self.totalRevenue = try container.decode(String.self, forKey: .totalRevenue)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.totalCustomers, forKey: .totalCustomers)
        try container.encode(self.newCustomers, forKey: .newCustomers)
        try container.encode(self.arpu, forKey: .arpu)
        try container.encode(self.totalRevenue, forKey: .totalRevenue)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case totalCustomers
        case newCustomers
        case arpu
        case totalRevenue
    }
}