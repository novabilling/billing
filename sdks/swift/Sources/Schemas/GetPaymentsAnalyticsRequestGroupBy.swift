import Foundation

public enum GetPaymentsAnalyticsRequestGroupBy: String, Codable, Hashable, CaseIterable, Sendable {
    case day
    case week
    case month
}