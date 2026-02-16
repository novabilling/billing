import Foundation

public struct PaginationMeta: Codable, Hashable, Sendable {
    public let total: Double
    public let page: Double
    public let limit: Double
    public let totalPages: Double
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        total: Double,
        page: Double,
        limit: Double,
        totalPages: Double,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.total = total
        self.page = page
        self.limit = limit
        self.totalPages = totalPages
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.total = try container.decode(Double.self, forKey: .total)
        self.page = try container.decode(Double.self, forKey: .page)
        self.limit = try container.decode(Double.self, forKey: .limit)
        self.totalPages = try container.decode(Double.self, forKey: .totalPages)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.total, forKey: .total)
        try container.encode(self.page, forKey: .page)
        try container.encode(self.limit, forKey: .limit)
        try container.encode(self.totalPages, forKey: .totalPages)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case total
        case page
        case limit
        case totalPages
    }
}