import Foundation

public struct PaginatedAddOnResponse: Codable, Hashable, Sendable {
    public let data: [AddOnResponse]
    public let meta: PaginationMeta
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        data: [AddOnResponse],
        meta: PaginationMeta,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.data = data
        self.meta = meta
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.data = try container.decode([AddOnResponse].self, forKey: .data)
        self.meta = try container.decode(PaginationMeta.self, forKey: .meta)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.data, forKey: .data)
        try container.encode(self.meta, forKey: .meta)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case data
        case meta
    }
}