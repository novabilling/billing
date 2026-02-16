import Foundation

public enum GetTransactionsWalletsRequestTransactionStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case purchased = "PURCHASED"
    case granted = "GRANTED"
    case voided = "VOIDED"
    case invoiced = "INVOICED"
}