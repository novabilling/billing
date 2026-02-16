import Foundation

public struct SubscriptionAnalyticsResponse: Codable, Hashable, Sendable {
    public let total: Double
    public let active: Double
    public let canceled: Double
    public let trialing: Double
    public let paused: Double
    public let newSubscriptions: Double
    /// Churn rate percentage
    public let churnRate: String
    /// Retention rate percentage
    public let retentionRate: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        total: Double,
        active: Double,
        canceled: Double,
        trialing: Double,
        paused: Double,
        newSubscriptions: Double,
        churnRate: String,
        retentionRate: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.total = total
        self.active = active
        self.canceled = canceled
        self.trialing = trialing
        self.paused = paused
        self.newSubscriptions = newSubscriptions
        self.churnRate = churnRate
        self.retentionRate = retentionRate
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.total = try container.decode(Double.self, forKey: .total)
        self.active = try container.decode(Double.self, forKey: .active)
        self.canceled = try container.decode(Double.self, forKey: .canceled)
        self.trialing = try container.decode(Double.self, forKey: .trialing)
        self.paused = try container.decode(Double.self, forKey: .paused)
        self.newSubscriptions = try container.decode(Double.self, forKey: .newSubscriptions)
        self.churnRate = try container.decode(String.self, forKey: .churnRate)
        self.retentionRate = try container.decode(String.self, forKey: .retentionRate)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.total, forKey: .total)
        try container.encode(self.active, forKey: .active)
        try container.encode(self.canceled, forKey: .canceled)
        try container.encode(self.trialing, forKey: .trialing)
        try container.encode(self.paused, forKey: .paused)
        try container.encode(self.newSubscriptions, forKey: .newSubscriptions)
        try container.encode(self.churnRate, forKey: .churnRate)
        try container.encode(self.retentionRate, forKey: .retentionRate)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case total
        case active
        case canceled
        case trialing
        case paused
        case newSubscriptions
        case churnRate
        case retentionRate
    }
}