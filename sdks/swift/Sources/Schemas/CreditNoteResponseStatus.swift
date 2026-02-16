import Foundation

public enum CreditNoteResponseStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case draft = "DRAFT"
    case finalized = "FINALIZED"
    case voided = "VOIDED"
}