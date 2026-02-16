import Foundation

public enum CreateChargeDtoBillingTiming: String, Codable, Hashable, CaseIterable, Sendable {
    case inAdvance = "IN_ADVANCE"
    case inArrears = "IN_ARREARS"
}