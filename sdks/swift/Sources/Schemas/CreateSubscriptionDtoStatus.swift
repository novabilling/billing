import Foundation

/// Override subscription status for imports
public enum CreateSubscriptionDtoStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case active = "ACTIVE"
    case trialing = "TRIALING"
    case paused = "PAUSED"
    case pastDue = "PAST_DUE"
    case canceled = "CANCELED"
}