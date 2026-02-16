import Foundation

public enum SubscriptionResponseStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case active = "ACTIVE"
    case pastDue = "PAST_DUE"
    case canceled = "CANCELED"
    case trialing = "TRIALING"
    case paused = "PAUSED"
}