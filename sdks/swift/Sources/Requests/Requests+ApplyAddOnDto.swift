import Foundation

extension Requests {
    public struct ApplyAddOnDto: Codable, Hashable, Sendable {
        /// Add-on ID
        public let addOnId: String
        /// Customer ID
        public let customerId: String
        /// Subscription to attach the charge to
        public let subscriptionId: String?
        /// Charge amount
        public let amount: Double
        /// Currency
        public let currency: String
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            addOnId: String,
            customerId: String,
            subscriptionId: String? = nil,
            amount: Double,
            currency: String,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.addOnId = addOnId
            self.customerId = customerId
            self.subscriptionId = subscriptionId
            self.amount = amount
            self.currency = currency
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.addOnId = try container.decode(String.self, forKey: .addOnId)
            self.customerId = try container.decode(String.self, forKey: .customerId)
            self.subscriptionId = try container.decodeIfPresent(String.self, forKey: .subscriptionId)
            self.amount = try container.decode(Double.self, forKey: .amount)
            self.currency = try container.decode(String.self, forKey: .currency)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.addOnId, forKey: .addOnId)
            try container.encode(self.customerId, forKey: .customerId)
            try container.encodeIfPresent(self.subscriptionId, forKey: .subscriptionId)
            try container.encode(self.amount, forKey: .amount)
            try container.encode(self.currency, forKey: .currency)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case addOnId
            case customerId
            case subscriptionId
            case amount
            case currency
        }
    }
}