import Foundation

public struct ChargeGraduatedRangeResponse: Codable, Hashable, Sendable {
    public let id: String
    public let chargeId: String
    public let fromValue: Double
    public let toValue: Double?
    /// Per-unit amount as decimal string
    public let perUnitAmount: String
    /// Flat fee for this range
    public let flatAmount: String
    public let order: Double
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        chargeId: String,
        fromValue: Double,
        toValue: Double? = nil,
        perUnitAmount: String,
        flatAmount: String,
        order: Double,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.chargeId = chargeId
        self.fromValue = fromValue
        self.toValue = toValue
        self.perUnitAmount = perUnitAmount
        self.flatAmount = flatAmount
        self.order = order
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.chargeId = try container.decode(String.self, forKey: .chargeId)
        self.fromValue = try container.decode(Double.self, forKey: .fromValue)
        self.toValue = try container.decodeIfPresent(Double.self, forKey: .toValue)
        self.perUnitAmount = try container.decode(String.self, forKey: .perUnitAmount)
        self.flatAmount = try container.decode(String.self, forKey: .flatAmount)
        self.order = try container.decode(Double.self, forKey: .order)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.chargeId, forKey: .chargeId)
        try container.encode(self.fromValue, forKey: .fromValue)
        try container.encodeIfPresent(self.toValue, forKey: .toValue)
        try container.encode(self.perUnitAmount, forKey: .perUnitAmount)
        try container.encode(self.flatAmount, forKey: .flatAmount)
        try container.encode(self.order, forKey: .order)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case chargeId
        case fromValue
        case toValue
        case perUnitAmount
        case flatAmount
        case order
    }
}