import Foundation

extension Requests {
    public struct RefreshTokenDto: Codable, Hashable, Sendable {
        /// Refresh token
        public let refreshToken: String
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            refreshToken: String,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.refreshToken = refreshToken
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.refreshToken = try container.decode(String.self, forKey: .refreshToken)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.refreshToken, forKey: .refreshToken)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case refreshToken
        }
    }
}