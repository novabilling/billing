import Foundation

/// Override status for imports
public enum CreateCreditNoteDtoStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case draft = "DRAFT"
    case finalized = "FINALIZED"
    case voided = "VOIDED"
}