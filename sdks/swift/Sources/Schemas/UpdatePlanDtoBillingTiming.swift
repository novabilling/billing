import Foundation

/// When to charge: IN_ADVANCE or IN_ARREARS
public enum UpdatePlanDtoBillingTiming: String, Codable, Hashable, CaseIterable, Sendable {
    case inAdvance = "IN_ADVANCE"
    case inArrears = "IN_ARREARS"
}