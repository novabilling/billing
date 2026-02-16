import Foundation

extension Requests {
    public struct UpdateCouponDto: Codable, Hashable, Sendable {
        public let name: String?
        public let description: String?
        public let isActive: Bool?
        public let expiresAt: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String? = nil,
            description: String? = nil,
            isActive: Bool? = nil,
            expiresAt: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.description = description
            self.isActive = isActive
            self.expiresAt = expiresAt
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decodeIfPresent(String.self, forKey: .name)
            self.description = try container.decodeIfPresent(String.self, forKey: .description)
            self.isActive = try container.decodeIfPresent(Bool.self, forKey: .isActive)
            self.expiresAt = try container.decodeIfPresent(String.self, forKey: .expiresAt)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encodeIfPresent(self.name, forKey: .name)
            try container.encodeIfPresent(self.description, forKey: .description)
            try container.encodeIfPresent(self.isActive, forKey: .isActive)
            try container.encodeIfPresent(self.expiresAt, forKey: .expiresAt)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case description
            case isActive
            case expiresAt
        }
    }
}