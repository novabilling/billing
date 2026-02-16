import Foundation

public struct MrrPlanBreakdown: Codable, Hashable, Sendable {
    public let planId: String
    public let planName: String
    public let mrr: Double
    public let subscriptionCount: Double
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        planId: String,
        planName: String,
        mrr: Double,
        subscriptionCount: Double,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.planId = planId
        self.planName = planName
        self.mrr = mrr
        self.subscriptionCount = subscriptionCount
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.planId = try container.decode(String.self, forKey: .planId)
        self.planName = try container.decode(String.self, forKey: .planName)
        self.mrr = try container.decode(Double.self, forKey: .mrr)
        self.subscriptionCount = try container.decode(Double.self, forKey: .subscriptionCount)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.planId, forKey: .planId)
        try container.encode(self.planName, forKey: .planName)
        try container.encode(self.mrr, forKey: .mrr)
        try container.encode(self.subscriptionCount, forKey: .subscriptionCount)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case planId
        case planName
        case mrr
        case subscriptionCount
    }
}