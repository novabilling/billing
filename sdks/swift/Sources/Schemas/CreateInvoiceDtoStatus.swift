import Foundation

/// Override invoice status for imports
public enum CreateInvoiceDtoStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case draft = "DRAFT"
    case pending = "PENDING"
    case paid = "PAID"
    case failed = "FAILED"
    case canceled = "CANCELED"
}