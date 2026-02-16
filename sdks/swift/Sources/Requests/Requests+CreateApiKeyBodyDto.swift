import Foundation

extension Requests {
    public struct CreateApiKeyBodyDto: Codable, Hashable, Sendable {
        public let name: String
        public let scopes: [String]
        public let expiresAt: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String,
            scopes: [String],
            expiresAt: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.scopes = scopes
            self.expiresAt = expiresAt
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decode(String.self, forKey: .name)
            self.scopes = try container.decode([String].self, forKey: .scopes)
            self.expiresAt = try container.decodeIfPresent(String.self, forKey: .expiresAt)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.name, forKey: .name)
            try container.encode(self.scopes, forKey: .scopes)
            try container.encodeIfPresent(self.expiresAt, forKey: .expiresAt)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case scopes
            case expiresAt
        }
    }
}