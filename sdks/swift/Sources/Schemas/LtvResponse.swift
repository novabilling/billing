import Foundation

public struct LtvResponse: Codable, Hashable, Sendable {
    public let avgLtv: Double
    public let avgLifespanDays: Double
    public let byPlan: [LtvPlanBreakdown]
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        avgLtv: Double,
        avgLifespanDays: Double,
        byPlan: [LtvPlanBreakdown],
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.avgLtv = avgLtv
        self.avgLifespanDays = avgLifespanDays
        self.byPlan = byPlan
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.avgLtv = try container.decode(Double.self, forKey: .avgLtv)
        self.avgLifespanDays = try container.decode(Double.self, forKey: .avgLifespanDays)
        self.byPlan = try container.decode([LtvPlanBreakdown].self, forKey: .byPlan)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.avgLtv, forKey: .avgLtv)
        try container.encode(self.avgLifespanDays, forKey: .avgLifespanDays)
        try container.encode(self.byPlan, forKey: .byPlan)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case avgLtv
        case avgLifespanDays
        case byPlan
    }
}