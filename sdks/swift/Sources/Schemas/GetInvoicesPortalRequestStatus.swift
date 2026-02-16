import Foundation

public enum GetInvoicesPortalRequestStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case pending = "PENDING"
    case paid = "PAID"
    case failed = "FAILED"
    case canceled = "CANCELED"
}