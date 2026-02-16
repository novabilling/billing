import Foundation

public enum CreatePaymentMethodDtoType: String, Codable, Hashable, CaseIterable, Sendable {
    case card = "CARD"
    case bankAccount = "BANK_ACCOUNT"
    case wallet = "WALLET"
}