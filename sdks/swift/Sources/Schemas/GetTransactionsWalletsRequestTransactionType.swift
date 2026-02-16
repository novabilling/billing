import Foundation

public enum GetTransactionsWalletsRequestTransactionType: String, Codable, Hashable, CaseIterable, Sendable {
    case inbound = "INBOUND"
    case outbound = "OUTBOUND"
}