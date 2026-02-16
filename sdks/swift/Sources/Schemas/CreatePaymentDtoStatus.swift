import Foundation

/// Payment status
public enum CreatePaymentDtoStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case processing = "PROCESSING"
    case succeeded = "SUCCEEDED"
    case failed = "FAILED"
    case refunded = "REFUNDED"
}