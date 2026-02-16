import Foundation

public struct GraduatedRangeDto: Codable, Hashable, Sendable {
    /// Start of range (inclusive)
    public let fromValue: Double
    /// End of range (inclusive), null = infinity
    public let toValue: Double?
    /// Price per unit in this range
    public let perUnitAmount: Double
    /// Flat fee for entering this range
    public let flatAmount: Double?
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        fromValue: Double,
        toValue: Double? = nil,
        perUnitAmount: Double,
        flatAmount: Double? = nil,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.fromValue = fromValue
        self.toValue = toValue
        self.perUnitAmount = perUnitAmount
        self.flatAmount = flatAmount
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.fromValue = try container.decode(Double.self, forKey: .fromValue)
        self.toValue = try container.decodeIfPresent(Double.self, forKey: .toValue)
        self.perUnitAmount = try container.decode(Double.self, forKey: .perUnitAmount)
        self.flatAmount = try container.decodeIfPresent(Double.self, forKey: .flatAmount)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.fromValue, forKey: .fromValue)
        try container.encodeIfPresent(self.toValue, forKey: .toValue)
        try container.encode(self.perUnitAmount, forKey: .perUnitAmount)
        try container.encodeIfPresent(self.flatAmount, forKey: .flatAmount)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case fromValue
        case toValue
        case perUnitAmount
        case flatAmount
    }
}