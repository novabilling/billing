import Foundation

extension Requests {
    public struct RegisterDto: Codable, Hashable, Sendable {
        /// Full name of the tenant owner
        public let name: String
        /// Email address
        public let email: String
        /// Password (min 8 characters)
        public let password: String
        /// Company name (used to generate slug)
        public let companyName: String
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String,
            email: String,
            password: String,
            companyName: String,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.email = email
            self.password = password
            self.companyName = companyName
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decode(String.self, forKey: .name)
            self.email = try container.decode(String.self, forKey: .email)
            self.password = try container.decode(String.self, forKey: .password)
            self.companyName = try container.decode(String.self, forKey: .companyName)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.name, forKey: .name)
            try container.encode(self.email, forKey: .email)
            try container.encode(self.password, forKey: .password)
            try container.encode(self.companyName, forKey: .companyName)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case email
            case password
            case companyName
        }
    }
}