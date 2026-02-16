import Foundation

public struct PaymentAnalyticsResponse: Codable, Hashable, Sendable {
    public let totalPayments: Double
    public let succeeded: Double
    public let failed: Double
    public let pending: Double
    /// Success rate percentage
    public let successRate: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        totalPayments: Double,
        succeeded: Double,
        failed: Double,
        pending: Double,
        successRate: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.totalPayments = totalPayments
        self.succeeded = succeeded
        self.failed = failed
        self.pending = pending
        self.successRate = successRate
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.totalPayments = try container.decode(Double.self, forKey: .totalPayments)
        self.succeeded = try container.decode(Double.self, forKey: .succeeded)
        self.failed = try container.decode(Double.self, forKey: .failed)
        self.pending = try container.decode(Double.self, forKey: .pending)
        self.successRate = try container.decode(String.self, forKey: .successRate)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.totalPayments, forKey: .totalPayments)
        try container.encode(self.succeeded, forKey: .succeeded)
        try container.encode(self.failed, forKey: .failed)
        try container.encode(self.pending, forKey: .pending)
        try container.encode(self.successRate, forKey: .successRate)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case totalPayments
        case succeeded
        case failed
        case pending
        case successRate
    }
}