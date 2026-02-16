import Foundation

public enum CreateCouponDtoDiscountType: String, Codable, Hashable, CaseIterable, Sendable {
    case percentage = "PERCENTAGE"
    case fixedAmount = "FIXED_AMOUNT"
}