import Foundation

public enum WalletTransactionResponseTransactionStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case purchased = "PURCHASED"
    case granted = "GRANTED"
    case voided = "VOIDED"
    case invoiced = "INVOICED"
}