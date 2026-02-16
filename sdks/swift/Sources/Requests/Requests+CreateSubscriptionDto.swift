import Foundation

extension Requests {
    public struct CreateSubscriptionDto: Codable, Hashable, Sendable {
        /// Customer ID
        public let customerId: String
        /// Plan ID
        public let planId: String
        /// Currency for billing
        public let currency: String
        /// Number of trial days
        public let trialDays: Double?
        public let metadata: [String: JSONValue]?
        /// Override subscription start date (ISO 8601). Defaults to now.
        public let startDate: String?
        /// Override current period end (ISO 8601). Defaults to calculated from startDate + billing interval.
        public let currentPeriodEnd: String?
        /// Override subscription status for imports
        public let status: CreateSubscriptionDtoStatus?
        /// Backdate createdAt (ISO 8601). For data imports.
        public let createdAt: String?
        /// External ID for linking to external systems
        public let externalId: String?
        /// Canceled at date (ISO 8601). For importing canceled subscriptions.
        public let canceledAt: String?
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            customerId: String,
            planId: String,
            currency: String,
            trialDays: Double? = nil,
            metadata: [String: JSONValue]? = nil,
            startDate: String? = nil,
            currentPeriodEnd: String? = nil,
            status: CreateSubscriptionDtoStatus? = nil,
            createdAt: String? = nil,
            externalId: String? = nil,
            canceledAt: String? = nil,
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.customerId = customerId
            self.planId = planId
            self.currency = currency
            self.trialDays = trialDays
            self.metadata = metadata
            self.startDate = startDate
            self.currentPeriodEnd = currentPeriodEnd
            self.status = status
            self.createdAt = createdAt
            self.externalId = externalId
            self.canceledAt = canceledAt
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.customerId = try container.decode(String.self, forKey: .customerId)
            self.planId = try container.decode(String.self, forKey: .planId)
            self.currency = try container.decode(String.self, forKey: .currency)
            self.trialDays = try container.decodeIfPresent(Double.self, forKey: .trialDays)
            self.metadata = try container.decodeIfPresent([String: JSONValue].self, forKey: .metadata)
            self.startDate = try container.decodeIfPresent(String.self, forKey: .startDate)
            self.currentPeriodEnd = try container.decodeIfPresent(String.self, forKey: .currentPeriodEnd)
            self.status = try container.decodeIfPresent(CreateSubscriptionDtoStatus.self, forKey: .status)
            self.createdAt = try container.decodeIfPresent(String.self, forKey: .createdAt)
            self.externalId = try container.decodeIfPresent(String.self, forKey: .externalId)
            self.canceledAt = try container.decodeIfPresent(String.self, forKey: .canceledAt)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.customerId, forKey: .customerId)
            try container.encode(self.planId, forKey: .planId)
            try container.encode(self.currency, forKey: .currency)
            try container.encodeIfPresent(self.trialDays, forKey: .trialDays)
            try container.encodeIfPresent(self.metadata, forKey: .metadata)
            try container.encodeIfPresent(self.startDate, forKey: .startDate)
            try container.encodeIfPresent(self.currentPeriodEnd, forKey: .currentPeriodEnd)
            try container.encodeIfPresent(self.status, forKey: .status)
            try container.encodeIfPresent(self.createdAt, forKey: .createdAt)
            try container.encodeIfPresent(self.externalId, forKey: .externalId)
            try container.encodeIfPresent(self.canceledAt, forKey: .canceledAt)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case customerId
            case planId
            case currency
            case trialDays
            case metadata
            case startDate
            case currentPeriodEnd
            case status
            case createdAt
            case externalId
            case canceledAt
        }
    }
}