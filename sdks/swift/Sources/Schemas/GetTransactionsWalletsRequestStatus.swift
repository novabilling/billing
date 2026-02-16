import Foundation

public enum GetTransactionsWalletsRequestStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case pending = "PENDING"
    case settled = "SETTLED"
    case failed = "FAILED"
}