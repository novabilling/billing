import Foundation

public struct TaxResponse: Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let code: String
    public let rate: String
    public let description: String?
    public let appliedByDefault: Bool
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        name: String,
        code: String,
        rate: String,
        description: String? = nil,
        appliedByDefault: Bool,
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
        self.name = name
        self.code = code
        self.rate = rate
        self.description = description
        self.appliedByDefault = appliedByDefault
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.name = try container.decode(String.self, forKey: .name)
        self.code = try container.decode(String.self, forKey: .code)
        self.rate = try container.decode(String.self, forKey: .rate)
        self.description = try container.decodeIfPresent(String.self, forKey: .description)
        self.appliedByDefault = try container.decode(Bool.self, forKey: .appliedByDefault)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.name, forKey: .name)
        try container.encode(self.code, forKey: .code)
        try container.encode(self.rate, forKey: .rate)
        try container.encodeIfPresent(self.description, forKey: .description)
        try container.encode(self.appliedByDefault, forKey: .appliedByDefault)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case name
        case code
        case rate
        case description
        case appliedByDefault
        case createdAt
        case updatedAt
    }
}