import Foundation

public enum ListWalletsRequestStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case active = "ACTIVE"
    case terminated = "TERMINATED"
}