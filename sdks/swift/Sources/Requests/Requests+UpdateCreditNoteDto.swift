import Foundation

extension Requests {
    public struct UpdateCreditNoteDto: Codable, Hashable, Sendable {
        /// Updated amount
        public let amount: Double?
        public let reason: UpdateCreditNoteDtoReason?
        public let metadata: [String: JSONValue]?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            amount: Double? = nil,
            reason: UpdateCreditNoteDtoReason? = nil,
            metadata: [String: JSONValue]? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.amount = amount
            self.reason = reason
            self.metadata = metadata
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.amount = try container.decodeIfPresent(Double.self, forKey: .amount)
            self.reason = try container.decodeIfPresent(UpdateCreditNoteDtoReason.self, forKey: .reason)
            self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encodeIfPresent(self.amount, forKey: .amount)
            try container.encodeIfPresent(self.reason, forKey: .reason)
            try container.encodeIfPresent(self.metadata, forKey: .metadata)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case amount
            case reason
            case metadata
        }
    }
}