import Foundation

extension Requests {
    public struct CreateChargeDto: Codable, Hashable, Sendable {
        /// Plan ID to attach this charge to
        public let planId: String
        /// Billable metric ID
        public let billableMetricId: String
        public let chargeModel: CreateChargeDtoChargeModel
        public let billingTiming: CreateChargeDtoBillingTiming?
        /// Display name on invoices
        public let invoiceDisplayName: String?
        /// Minimum charge in cents
        public let minAmountCents: Double?
        public let prorated: Bool?
        /// Model-specific config. Standard: { amount, currency }. Package: { amount, packageSize, currency }. Percentage: { rate, fixedAmount, freeUnitsPerEvent, freeUnitsPerTotalAggregation }
        public let properties: [String: JSONValue]?
        /// Required for GRADUATED and VOLUME charge models
        public let graduatedRanges: [GraduatedRangeDto]?
        public let filters: [ChargeFilterDto]?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            planId: String,
            billableMetricId: String,
            chargeModel: CreateChargeDtoChargeModel,
            billingTiming: CreateChargeDtoBillingTiming? = nil,
            invoiceDisplayName: String? = nil,
            minAmountCents: Double? = nil,
            prorated: Bool? = nil,
            properties: [String: JSONValue]? = nil,
            graduatedRanges: [GraduatedRangeDto]? = nil,
            filters: [ChargeFilterDto]? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.planId = planId
            self.billableMetricId = billableMetricId
            self.chargeModel = chargeModel
            self.billingTiming = billingTiming
            self.invoiceDisplayName = invoiceDisplayName
            self.minAmountCents = minAmountCents
            self.prorated = prorated
            self.properties = properties
            self.graduatedRanges = graduatedRanges
            self.filters = filters
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.planId = try container.decode(String.self, forKey: .planId)
            self.billableMetricId = try container.decode(String.self, forKey: .billableMetricId)
            self.chargeModel = try container.decode(CreateChargeDtoChargeModel.self, forKey: .chargeModel)
            self.billingTiming = try container.decodeIfPresent(CreateChargeDtoBillingTiming.self, forKey: .billingTiming)
            self.invoiceDisplayName = try container.decodeIfPresent(String.self, forKey: .invoiceDisplayName)
            self.minAmountCents = try container.decodeIfPresent(Double.self, forKey: .minAmountCents)
            self.prorated = try container.decodeIfPresent(Bool.self, forKey: .prorated)
            self.properties = try container.decodeIfPresent([String: JSONValue].self, forKey: .properties)
            self.graduatedRanges = try container.decodeIfPresent([GraduatedRangeDto].self, forKey: .graduatedRanges)
            self.filters = try container.decodeIfPresent([ChargeFilterDto].self, forKey: .filters)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.planId, forKey: .planId)
            try container.encode(self.billableMetricId, forKey: .billableMetricId)
            try container.encode(self.chargeModel, forKey: .chargeModel)
            try container.encodeIfPresent(self.billingTiming, forKey: .billingTiming)
            try container.encodeIfPresent(self.invoiceDisplayName, forKey: .invoiceDisplayName)
            try container.encodeIfPresent(self.minAmountCents, forKey: .minAmountCents)
            try container.encodeIfPresent(self.prorated, forKey: .prorated)
            try container.encodeIfPresent(self.properties, forKey: .properties)
            try container.encodeIfPresent(self.graduatedRanges, forKey: .graduatedRanges)
            try container.encodeIfPresent(self.filters, forKey: .filters)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case planId
            case billableMetricId
            case chargeModel
            case billingTiming
            case invoiceDisplayName
            case minAmountCents
            case prorated
            case properties
            case graduatedRanges
            case filters
        }
    }
}