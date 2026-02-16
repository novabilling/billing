import Foundation

/// When to charge: IN_ADVANCE (at period start) or IN_ARREARS (at period end). Defaults to IN_ARREARS.
public enum CreatePlanDtoBillingTiming: String, Codable, Hashable, CaseIterable, Sendable {
    case inAdvance = "IN_ADVANCE"
    case inArrears = "IN_ARREARS"
}