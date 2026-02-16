import Foundation

public struct BatchEventResponse: Codable, Hashable, Sendable {
    public let received: Double
    public let processed: Double
    public let duplicates: Double
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        received: Double,
        processed: Double,
        duplicates: Double,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.received = received
        self.processed = processed
        self.duplicates = duplicates
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.received = try container.decode(Double.self, forKey: .received)
        self.processed = try container.decode(Double.self, forKey: .processed)
        self.duplicates = try container.decode(Double.self, forKey: .duplicates)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.received, forKey: .received)
        try container.encode(self.processed, forKey: .processed)
        try container.encode(self.duplicates, forKey: .duplicates)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case received
        case processed
        case duplicates
    }
}