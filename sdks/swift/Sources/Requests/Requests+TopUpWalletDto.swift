import Foundation

extension Requests {
    public struct TopUpWalletDto: Codable, Hashable, Sendable {
        public let walletId: String
        /// Paid credits to purchase
        public let paidCredits: Double?
        /// Free credits to grant
        public let grantedCredits: Double?
        /// Credits to void
        public let voidedCredits: Double?
        public let metadata: [String: JSONValue]?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            walletId: String,
            paidCredits: Double? = nil,
            grantedCredits: Double? = nil,
            voidedCredits: Double? = nil,
            metadata: [String: JSONValue]? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.walletId = walletId
            self.paidCredits = paidCredits
            self.grantedCredits = grantedCredits
            self.voidedCredits = voidedCredits
            self.metadata = metadata
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.walletId = try container.decode(String.self, forKey: .walletId)
            self.paidCredits = try container.decodeIfPresent(Double.self, forKey: .paidCredits)
            self.grantedCredits = try container.decodeIfPresent(Double.self, forKey: .grantedCredits)
            self.voidedCredits = try container.decodeIfPresent(Double.self, forKey: .voidedCredits)
            self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.walletId, forKey: .walletId)
            try container.encodeIfPresent(self.paidCredits, forKey: .paidCredits)
            try container.encodeIfPresent(self.grantedCredits, forKey: .grantedCredits)
            try container.encodeIfPresent(self.voidedCredits, forKey: .voidedCredits)
            try container.encodeIfPresent(self.metadata, forKey: .metadata)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case walletId
            case paidCredits
            case grantedCredits
            case voidedCredits
            case metadata
        }
    }
}