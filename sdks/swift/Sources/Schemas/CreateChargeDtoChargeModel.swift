import Foundation

public enum CreateChargeDtoChargeModel: String, Codable, Hashable, CaseIterable, Sendable {
    case standard = "STANDARD"
    case graduated = "GRADUATED"
    case volume = "VOLUME"
    case package = "PACKAGE"
    case percentage = "PERCENTAGE"
}