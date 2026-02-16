import Foundation

public enum InvoiceResponseStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case draft = "DRAFT"
    case pending = "PENDING"
    case paid = "PAID"
    case failed = "FAILED"
    case canceled = "CANCELED"
}