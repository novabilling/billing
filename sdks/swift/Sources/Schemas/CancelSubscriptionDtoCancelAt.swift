import Foundation

/// When to cancel: immediately or at end of current period
public enum CancelSubscriptionDtoCancelAt: String, Codable, Hashable, CaseIterable, Sendable {
    case now
    case periodEnd = "period_end"
}