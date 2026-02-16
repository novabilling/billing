import Foundation

public enum ListCreditNotesRequestStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case draft = "DRAFT"
    case finalized = "FINALIZED"
    case voided = "VOIDED"
}