import Foundation

extension Requests {
    public struct CreateProviderDto: Codable, Hashable, Sendable {
        /// Provider name
        public let providerName: String
        /// Provider credentials (will be encrypted)
        public let credentials: [String: JSONValue]
        public let isActive: Bool?
        /// Priority (lower = higher)
        public let priority: Double?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            providerName: String,
            credentials: [String: JSONValue],
            isActive: Bool? = nil,
            priority: Double? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.providerName = providerName
            self.credentials = credentials
            self.isActive = isActive
            self.priority = priority
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.providerName = try container.decode(String.self, forKey: .providerName)
            self.credentials = try container.decode([String: JSONValue].self, forKey: .credentials)
            self.isActive = try container.decodeIfPresent(Bool.self, forKey: .isActive)
            self.priority = try container.decodeIfPresent(Double.self, forKey: .priority)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.providerName, forKey: .providerName)
            try container.encode(self.credentials, forKey: .credentials)
            try container.encodeIfPresent(self.isActive, forKey: .isActive)
            try container.encodeIfPresent(self.priority, forKey: .priority)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case providerName
            case credentials
            case isActive
            case priority
        }
    }
}