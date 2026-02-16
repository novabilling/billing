import Foundation

extension Requests {
    public struct UpdateTenantDto: Codable, Hashable, Sendable {
        public let name: String?
        public let email: String?
        public let webhookUrl: String?
        /// Custom tenant settings (merged with existing)
        public let settings: [String: JSONValue]?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String? = nil,
            email: String? = nil,
            webhookUrl: String? = nil,
            settings: [String: JSONValue]? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.email = email
            self.webhookUrl = webhookUrl
            self.settings = settings
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decodeIfPresent(String.self, forKey: .name)
            self.email = try container.decodeIfPresent(String.self, forKey: .email)
            self.webhookUrl = try container.decodeIfPresent(String.self, forKey: .webhookUrl)
            self.settings = try container.decodeIfPresent([String: JSONValue].self, forKey: .settings)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encodeIfPresent(self.name, forKey: .name)
            try container.encodeIfPresent(self.email, forKey: .email)
            try container.encodeIfPresent(self.webhookUrl, forKey: .webhookUrl)
            try container.encodeIfPresent(self.settings, forKey: .settings)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case email
            case webhookUrl
            case settings
        }
    }
}