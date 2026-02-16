import Foundation

public struct AssignTaxDto: Codable, Hashable, Sendable {
    /// Tax ID to assign
    public let taxId: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        taxId: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.taxId = taxId
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.taxId = try container.decode(String.self, forKey: .taxId)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.taxId, forKey: .taxId)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case taxId
    }
}