import Foundation

public struct MrrBreakdownResponse: Codable, Hashable, Sendable {
    public let totalMrr: Double
    public let newMrr: Double
    public let expansionMrr: Double
    public let contractionMrr: Double
    public let churnMrr: Double
    public let netNewMrr: Double
    public let byPlan: [MrrPlanBreakdown]
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        totalMrr: Double,
        newMrr: Double,
        expansionMrr: Double,
        contractionMrr: Double,
        churnMrr: Double,
        netNewMrr: Double,
        byPlan: [MrrPlanBreakdown],
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.totalMrr = totalMrr
        self.newMrr = newMrr
        self.expansionMrr = expansionMrr
        self.contractionMrr = contractionMrr
        self.churnMrr = churnMrr
        self.netNewMrr = netNewMrr
        self.byPlan = byPlan
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.totalMrr = try container.decode(Double.self, forKey: .totalMrr)
        self.newMrr = try container.decode(Double.self, forKey: .newMrr)
        self.expansionMrr = try container.decode(Double.self, forKey: .expansionMrr)
        self.contractionMrr = try container.decode(Double.self, forKey: .contractionMrr)
        self.churnMrr = try container.decode(Double.self, forKey: .churnMrr)
        self.netNewMrr = try container.decode(Double.self, forKey: .netNewMrr)
        self.byPlan = try container.decode([MrrPlanBreakdown].self, forKey: .byPlan)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.totalMrr, forKey: .totalMrr)
        try container.encode(self.newMrr, forKey: .newMrr)
        try container.encode(self.expansionMrr, forKey: .expansionMrr)
        try container.encode(self.contractionMrr, forKey: .contractionMrr)
        try container.encode(self.churnMrr, forKey: .churnMrr)
        try container.encode(self.netNewMrr, forKey: .netNewMrr)
        try container.encode(self.byPlan, forKey: .byPlan)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case totalMrr
        case newMrr
        case expansionMrr
        case contractionMrr
        case churnMrr
        case netNewMrr
        case byPlan
    }
}