import Foundation

extension Requests {
    public struct CancelSubscriptionDto: Codable, Hashable, Sendable {
        /// When to cancel: immediately or at end of current period
        public let cancelAt: CancelSubscriptionDtoCancelAt
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            cancelAt: CancelSubscriptionDtoCancelAt,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.cancelAt = cancelAt
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.cancelAt = try container.decode(CancelSubscriptionDtoCancelAt.self, forKey: .cancelAt)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.cancelAt, forKey: .cancelAt)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case cancelAt
        }
    }
}