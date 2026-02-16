import Foundation

extension Requests {
    public struct CreateCouponDto: Codable, Hashable, Sendable {
        /// Unique coupon code
        public let code: String
        /// Display name
        public let name: String
        public let description: String?
        public let discountType: CreateCouponDtoDiscountType
        /// Discount value (percentage 0-100 or fixed amount)
        public let discountValue: Double
        /// Currency for FIXED_AMOUNT discounts
        public let currency: String?
        /// Max number of redemptions (null = unlimited)
        public let maxRedemptions: Double?
        /// Plan IDs this coupon applies to (empty = all)
        public let appliesToPlanIds: [String]?
        public let expiresAt: String?
        /// Backdate createdAt (ISO 8601). For data imports.
        public let createdAt: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            code: String,
            name: String,
            description: String? = nil,
            discountType: CreateCouponDtoDiscountType,
            discountValue: Double,
            currency: String? = nil,
            maxRedemptions: Double? = nil,
            appliesToPlanIds: [String]? = nil,
            expiresAt: String? = nil,
            createdAt: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.code = code
            self.name = name
            self.description = description
            self.discountType = discountType
            self.discountValue = discountValue
            self.currency = currency
            self.maxRedemptions = maxRedemptions
            self.appliesToPlanIds = appliesToPlanIds
            self.expiresAt = expiresAt
            self.createdAt = createdAt
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.code = try container.decode(String.self, forKey: .code)
            self.name = try container.decode(String.self, forKey: .name)
            self.description = try container.decodeIfPresent(String.self, forKey: .description)
            self.discountType = try container.decode(CreateCouponDtoDiscountType.self, forKey: .discountType)
            self.discountValue = try container.decode(Double.self, forKey: .discountValue)
            self.currency = try container.decodeIfPresent(String.self, forKey: .currency)
            self.maxRedemptions = try container.decodeIfPresent(Double.self, forKey: .maxRedemptions)
            self.appliesToPlanIds = try container.decodeIfPresent([String].self, forKey: .appliesToPlanIds)
            self.expiresAt = try container.decodeIfPresent(String.self, forKey: .expiresAt)
            self.createdAt = try container.decodeIfPresent(String.self, forKey: .createdAt)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.code, forKey: .code)
            try container.encode(self.name, forKey: .name)
            try container.encodeIfPresent(self.description, forKey: .description)
            try container.encode(self.discountType, forKey: .discountType)
            try container.encode(self.discountValue, forKey: .discountValue)
            try container.encodeIfPresent(self.currency, forKey: .currency)
            try container.encodeIfPresent(self.maxRedemptions, forKey: .maxRedemptions)
            try container.encodeIfPresent(self.appliesToPlanIds, forKey: .appliesToPlanIds)
            try container.encodeIfPresent(self.expiresAt, forKey: .expiresAt)
            try container.encodeIfPresent(self.createdAt, forKey: .createdAt)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case code
            case name
            case description
            case discountType
            case discountValue
            case currency
            case maxRedemptions
            case appliesToPlanIds
            case expiresAt
            case createdAt
        }
    }
}