import Foundation

public enum GetCustomersAnalyticsRequestGroupBy: String, Codable, Hashable, CaseIterable, Sendable {
    case day
    case week
    case month
}