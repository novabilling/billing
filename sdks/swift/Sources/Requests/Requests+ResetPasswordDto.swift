import Foundation

extension Requests {
    public struct ResetPasswordDto: Codable, Hashable, Sendable {
        /// Password reset token
        public let token: String
        /// New password (min 8 characters)
        public let newPassword: String
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            token: String,
            newPassword: String,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.token = token
            self.newPassword = newPassword
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.token = try container.decode(String.self, forKey: .token)
            self.newPassword = try container.decode(String.self, forKey: .newPassword)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.token, forKey: .token)
            try container.encode(self.newPassword, forKey: .newPassword)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case token
            case newPassword
        }
    }
}