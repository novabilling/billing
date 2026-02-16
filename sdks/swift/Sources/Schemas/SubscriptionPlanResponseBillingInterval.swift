import Foundation

public enum SubscriptionPlanResponseBillingInterval: String, Codable, Hashable, CaseIterable, Sendable {
    case hourly = "HOURLY"
    case daily = "DAILY"
    case weekly = "WEEKLY"
    case monthly = "MONTHLY"
    case quarterly = "QUARTERLY"
    case yearly = "YEARLY"
}