import Foundation

extension Requests {
    public struct UpdateChargeDto: Codable, Hashable, Sendable {
        public let billingTiming: UpdateChargeDtoBillingTiming?
        public let invoiceDisplayName: String?
        public let minAmountCents: Double?
        public let prorated: Bool?
        public let properties: [String: JSONValue]?
        public let graduatedRanges: [GraduatedRangeDto]?
        public let filters: [ChargeFilterDto]?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            billingTiming: UpdateChargeDtoBillingTiming? = nil,
            invoiceDisplayName: String? = nil,
            minAmountCents: Double? = nil,
            prorated: Bool? = nil,
            properties: [String: JSONValue]? = nil,
            graduatedRanges: [GraduatedRangeDto]? = nil,
            filters: [ChargeFilterDto]? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
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
            self.billingTiming = try container.decodeIfPresent(UpdateChargeDtoBillingTiming.self, forKey: .billingTiming)
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