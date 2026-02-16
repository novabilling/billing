import Foundation

public enum UpdateChargeDtoBillingTiming: String, Codable, Hashable, CaseIterable, Sendable {
    case inAdvance = "IN_ADVANCE"
    case inArrears = "IN_ARREARS"
}