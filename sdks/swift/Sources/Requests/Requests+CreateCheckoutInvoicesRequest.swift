import Foundation

extension Requests {
    public struct CreateCheckoutInvoicesRequest: Codable, Hashable, Sendable {
        /// URL to redirect customer after payment
        public let callbackUrl: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            callbackUrl: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.callbackUrl = callbackUrl
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.callbackUrl = try container.decodeIfPresent(String.self, forKey: .callbackUrl)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encodeIfPresent(self.callbackUrl, forKey: .callbackUrl)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case callbackUrl
        }
    }
}