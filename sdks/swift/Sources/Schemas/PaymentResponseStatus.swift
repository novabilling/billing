import Foundation

public enum PaymentResponseStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case pending = "PENDING"
    case processing = "PROCESSING"
    case succeeded = "SUCCEEDED"
    case failed = "FAILED"
    case refunded = "REFUNDED"
}