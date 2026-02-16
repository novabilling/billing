import Foundation

public struct ChargeResponse: Codable, Hashable, Sendable {
    public let id: String
    public let planId: String
    public let billableMetricId: String
    public let chargeModel: ChargeResponseChargeModel
    public let billingTiming: ChargeResponseBillingTiming
    public let invoiceDisplayName: String?
    public let minAmountCents: Double?
    public let prorated: Bool
    /// Model-specific config
    public let properties: [String: JSONValue]?
    public let graduatedRanges: [ChargeGraduatedRangeResponse]
    public let filters: [ChargeFilterResponse]
    public let createdAt: String
    public let updatedAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        id: String,
        planId: String,
        billableMetricId: String,
        chargeModel: ChargeResponseChargeModel,
        billingTiming: ChargeResponseBillingTiming,
        invoiceDisplayName: String? = nil,
        minAmountCents: Double? = nil,
        prorated: Bool,
        properties: [String: JSONValue]? = nil,
        graduatedRanges: [ChargeGraduatedRangeResponse],
        filters: [ChargeFilterResponse],
        createdAt: String,
        updatedAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.id = id
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
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.planId = try container.decode(String.self, forKey: .planId)
        self.billableMetricId = try container.decode(String.self, forKey: .billableMetricId)
        self.chargeModel = try container.decode(ChargeResponseChargeModel.self, forKey: .chargeModel)
        self.billingTiming = try container.decode(ChargeResponseBillingTiming.self, forKey: .billingTiming)
        self.invoiceDisplayName = try container.decodeIfPresent(String.self, forKey: .invoiceDisplayName)
        self.minAmountCents = try container.decodeIfPresent(Double.self, forKey: .minAmountCents)
        self.prorated = try container.decode(Bool.self, forKey: .prorated)
        self.properties = try container.decodeIfPresent([String: JSONValue].self, forKey: .properties)
        self.graduatedRanges = try container.decode([ChargeGraduatedRangeResponse].self, forKey: .graduatedRanges)
        self.filters = try container.decode([ChargeFilterResponse].self, forKey: .filters)
        self.createdAt = try container.decode(String.self, forKey: .createdAt)
        self.updatedAt = try container.decode(String.self, forKey: .updatedAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.planId, forKey: .planId)
        try container.encode(self.billableMetricId, forKey: .billableMetricId)
        try container.encode(self.chargeModel, forKey: .chargeModel)
        try container.encode(self.billingTiming, forKey: .billingTiming)
        try container.encodeIfPresent(self.invoiceDisplayName, forKey: .invoiceDisplayName)
        try container.encodeIfPresent(self.minAmountCents, forKey: .minAmountCents)
        try container.encode(self.prorated, forKey: .prorated)
        try container.encodeIfPresent(self.properties, forKey: .properties)
        try container.encode(self.graduatedRanges, forKey: .graduatedRanges)
        try container.encode(self.filters, forKey: .filters)
        try container.encode(self.createdAt, forKey: .createdAt)
        try container.encode(self.updatedAt, forKey: .updatedAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case id
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
        case createdAt
        case updatedAt
    }
}