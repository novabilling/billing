import Foundation

public struct CohortRow: Codable, Hashable, Sendable {
    public let month: String
    public let totalCustomers: Double
    public let retentionPercentages: [Double]
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        month: String,
        totalCustomers: Double,
        retentionPercentages: [Double],
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.month = month
        self.totalCustomers = totalCustomers
        self.retentionPercentages = retentionPercentages
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.month = try container.decode(String.self, forKey: .month)
        self.totalCustomers = try container.decode(Double.self, forKey: .totalCustomers)
        self.retentionPercentages = try container.decode([Double].self, forKey: .retentionPercentages)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.month, forKey: .month)
        try container.encode(self.totalCustomers, forKey: .totalCustomers)
        try container.encode(self.retentionPercentages, forKey: .retentionPercentages)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case month
        case totalCustomers
        case retentionPercentages
    }
}