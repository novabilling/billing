import Foundation

public enum WalletTransactionResponseTransactionType: String, Codable, Hashable, CaseIterable, Sendable {
    case inbound = "INBOUND"
    case outbound = "OUTBOUND"
}