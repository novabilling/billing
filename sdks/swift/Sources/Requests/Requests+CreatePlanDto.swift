import Foundation

extension Requests {
    public struct CreatePlanDto: Codable, Hashable, Sendable {
        public let name: String
        /// Unique plan code (lowercase, underscores)
        public let code: String
        public let description: String?
        public let billingInterval: CreatePlanDtoBillingInterval
        /// When to charge: IN_ADVANCE (at period start) or IN_ARREARS (at period end). Defaults to IN_ARREARS.
        public let billingTiming: CreatePlanDtoBillingTiming?
        public let features: [String]?
        public let prices: [CreatePlanPriceDto]?
        /// Net payment terms in days (overrides org default)
        public let netPaymentTerms: Double?
        /// Grace period in days before draft invoices are finalized
        public let invoiceGracePeriodDays: Double?
        /// Usage cost threshold for mid-cycle progressive billing invoices
        public let progressiveBillingThreshold: Double?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String,
            code: String,
            description: String? = nil,
            billingInterval: CreatePlanDtoBillingInterval,
            billingTiming: CreatePlanDtoBillingTiming? = nil,
            features: [String]? = nil,
            prices: [CreatePlanPriceDto]? = nil,
            netPaymentTerms: Double? = nil,
            invoiceGracePeriodDays: Double? = nil,
            progressiveBillingThreshold: Double? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.code = code
            self.description = description
            self.billingInterval = billingInterval
            self.billingTiming = billingTiming
            self.features = features
            self.prices = prices
            self.netPaymentTerms = netPaymentTerms
            self.invoiceGracePeriodDays = invoiceGracePeriodDays
            self.progressiveBillingThreshold = progressiveBillingThreshold
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decode(String.self, forKey: .name)
            self.code = try container.decode(String.self, forKey: .code)
            self.description = try container.decodeIfPresent(String.self, forKey: .description)
            self.billingInterval = try container.decode(CreatePlanDtoBillingInterval.self, forKey: .billingInterval)
            self.billingTiming = try container.decodeIfPresent(CreatePlanDtoBillingTiming.self, forKey: .billingTiming)
            self.features = try container.decodeIfPresent([String].self, forKey: .features)
            self.prices = try container.decodeIfPresent([CreatePlanPriceDto].self, forKey: .prices)
            self.netPaymentTerms = try container.decodeIfPresent(Double.self, forKey: .netPaymentTerms)
            self.invoiceGracePeriodDays = try container.decodeIfPresent(Double.self, forKey: .invoiceGracePeriodDays)
            self.progressiveBillingThreshold = try container.decodeIfPresent(Double.self, forKey: .progressiveBillingThreshold)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.name, forKey: .name)
            try container.encode(self.code, forKey: .code)
            try container.encodeIfPresent(self.description, forKey: .description)
            try container.encode(self.billingInterval, forKey: .billingInterval)
            try container.encodeIfPresent(self.billingTiming, forKey: .billingTiming)
            try container.encodeIfPresent(self.features, forKey: .features)
            try container.encodeIfPresent(self.prices, forKey: .prices)
            try container.encodeIfPresent(self.netPaymentTerms, forKey: .netPaymentTerms)
            try container.encodeIfPresent(self.invoiceGracePeriodDays, forKey: .invoiceGracePeriodDays)
            try container.encodeIfPresent(self.progressiveBillingThreshold, forKey: .progressiveBillingThreshold)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case code
            case description
            case billingInterval
            case billingTiming
            case features
            case prices
            case netPaymentTerms
            case invoiceGracePeriodDays
            case progressiveBillingThreshold
        }
    }
}