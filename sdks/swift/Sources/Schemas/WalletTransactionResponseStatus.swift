import Foundation

public enum WalletTransactionResponseStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case pending = "PENDING"
    case settled = "SETTLED"
    case failed = "FAILED"
}