import Foundation

extension Requests {
    public struct UpdatePlanDto: Codable, Hashable, Sendable {
        public let name: String?
        public let description: String?
        public let billingInterval: UpdatePlanDtoBillingInterval?
        /// When to charge: IN_ADVANCE or IN_ARREARS
        public let billingTiming: UpdatePlanDtoBillingTiming?
        public let features: [String]?
        public let isActive: Bool?
        /// Net payment terms in days
        public let netPaymentTerms: Double?
        /// Grace period in days before draft invoices are finalized
        public let invoiceGracePeriodDays: Double?
        /// Usage cost threshold for progressive billing
        public let progressiveBillingThreshold: Double?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            name: String? = nil,
            description: String? = nil,
            billingInterval: UpdatePlanDtoBillingInterval? = nil,
            billingTiming: UpdatePlanDtoBillingTiming? = nil,
            features: [String]? = nil,
            isActive: Bool? = nil,
            netPaymentTerms: Double? = nil,
            invoiceGracePeriodDays: Double? = nil,
            progressiveBillingThreshold: Double? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.name = name
            self.description = description
            self.billingInterval = billingInterval
            self.billingTiming = billingTiming
            self.features = features
            self.isActive = isActive
            self.netPaymentTerms = netPaymentTerms
            self.invoiceGracePeriodDays = invoiceGracePeriodDays
            self.progressiveBillingThreshold = progressiveBillingThreshold
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.name = try container.decodeIfPresent(String.self, forKey: .name)
            self.description = try container.decodeIfPresent(String.self, forKey: .description)
            self.billingInterval = try container.decodeIfPresent(UpdatePlanDtoBillingInterval.self, forKey: .billingInterval)
            self.billingTiming = try container.decodeIfPresent(UpdatePlanDtoBillingTiming.self, forKey: .billingTiming)
            self.features = try container.decodeIfPresent([String].self, forKey: .features)
            self.isActive = try container.decodeIfPresent(Bool.self, forKey: .isActive)
            self.netPaymentTerms = try container.decodeIfPresent(Double.self, forKey: .netPaymentTerms)
            self.invoiceGracePeriodDays = try container.decodeIfPresent(Double.self, forKey: .invoiceGracePeriodDays)
            self.progressiveBillingThreshold = try container.decodeIfPresent(Double.self, forKey: .progressiveBillingThreshold)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encodeIfPresent(self.name, forKey: .name)
            try container.encodeIfPresent(self.description, forKey: .description)
            try container.encodeIfPresent(self.billingInterval, forKey: .billingInterval)
            try container.encodeIfPresent(self.billingTiming, forKey: .billingTiming)
            try container.encodeIfPresent(self.features, forKey: .features)
            try container.encodeIfPresent(self.isActive, forKey: .isActive)
            try container.encodeIfPresent(self.netPaymentTerms, forKey: .netPaymentTerms)
            try container.encodeIfPresent(self.invoiceGracePeriodDays, forKey: .invoiceGracePeriodDays)
            try container.encodeIfPresent(self.progressiveBillingThreshold, forKey: .progressiveBillingThreshold)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case name
            case description
            case billingInterval
            case billingTiming
            case features
            case isActive
            case netPaymentTerms
            case invoiceGracePeriodDays
            case progressiveBillingThreshold
        }
    }
}