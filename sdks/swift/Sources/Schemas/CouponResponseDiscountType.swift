import Foundation

public enum CouponResponseDiscountType: String, Codable, Hashable, CaseIterable, Sendable {
    case percentage = "PERCENTAGE"
    case fixedAmount = "FIXED_AMOUNT"
}