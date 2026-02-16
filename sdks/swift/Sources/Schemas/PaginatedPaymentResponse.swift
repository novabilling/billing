import Foundation

public struct PaginatedPaymentResponse: Codable, Hashable, Sendable {
    public let data: [PaymentResponse]
    public let meta: PaginationMeta
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        data: [PaymentResponse],
        meta: PaginationMeta,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.data = data
        self.meta = meta
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.data = try container.decode([PaymentResponse].self, forKey: .data)
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