import Foundation

public enum CreateCreditNoteDtoReason: String, Codable, Hashable, CaseIterable, Sendable {
    case duplicate = "DUPLICATE"
    case productUnsatisfactory = "PRODUCT_UNSATISFACTORY"
    case orderChange = "ORDER_CHANGE"
    case other = "OTHER"
}