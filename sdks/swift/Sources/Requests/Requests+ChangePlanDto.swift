import Foundation

extension Requests {
    public struct ChangePlanDto: Codable, Hashable, Sendable {
        /// New plan ID
        public let newPlanId: String
        /// Whether to prorate charges
        public let prorate: Bool?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            newPlanId: String,
            prorate: Bool? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.newPlanId = newPlanId
            self.prorate = prorate
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.newPlanId = try container.decode(String.self, forKey: .newPlanId)
            self.prorate = try container.decodeIfPresent(Bool.self, forKey: .prorate)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.newPlanId, forKey: .newPlanId)
            try container.encodeIfPresent(self.prorate, forKey: .prorate)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case newPlanId
            case prorate
        }
    }
}