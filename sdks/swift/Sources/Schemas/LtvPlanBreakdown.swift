import Foundation

public struct LtvPlanBreakdown: Codable, Hashable, Sendable {
    public let planId: String
    public let planName: String
    public let avgLtv: Double
    public let avgLifespanDays: Double
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        planId: String,
        planName: String,
        avgLtv: Double,
        avgLifespanDays: Double,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.planId = planId
        self.planName = planName
        self.avgLtv = avgLtv
        self.avgLifespanDays = avgLifespanDays
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.planId = try container.decode(String.self, forKey: .planId)
        self.planName = try container.decode(String.self, forKey: .planName)
        self.avgLtv = try container.decode(Double.self, forKey: .avgLtv)
        self.avgLifespanDays = try container.decode(Double.self, forKey: .avgLifespanDays)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.planId, forKey: .planId)
        try container.encode(self.planName, forKey: .planName)
        try container.encode(self.avgLtv, forKey: .avgLtv)
        try container.encode(self.avgLifespanDays, forKey: .avgLifespanDays)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case planId
        case planName
        case avgLtv
        case avgLifespanDays
    }
}