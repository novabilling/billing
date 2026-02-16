import Foundation

extension Requests {
    public struct ApplyCouponDto: Codable, Hashable, Sendable {
        public let couponId: String
        public let customerId: String
        public let subscriptionId: String?
        /// Number of billing cycles to apply (null = forever)
        public let usesRemaining: Double?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            couponId: String,
            customerId: String,
            subscriptionId: String? = nil,
            usesRemaining: Double? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.couponId = couponId
            self.customerId = customerId
            self.subscriptionId = subscriptionId
            self.usesRemaining = usesRemaining
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.couponId = try container.decode(String.self, forKey: .couponId)
            self.customerId = try container.decode(String.self, forKey: .customerId)
            self.subscriptionId = try container.decodeIfPresent(String.self, forKey: .subscriptionId)
            self.usesRemaining = try container.decodeIfPresent(Double.self, forKey: .usesRemaining)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.couponId, forKey: .couponId)
            try container.encode(self.customerId, forKey: .customerId)
            try container.encodeIfPresent(self.subscriptionId, forKey: .subscriptionId)
            try container.encodeIfPresent(self.usesRemaining, forKey: .usesRemaining)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case couponId
            case customerId
            case subscriptionId
            case usesRemaining
        }
    }
}