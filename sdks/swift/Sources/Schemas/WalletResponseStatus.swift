import Foundation

public enum WalletResponseStatus: String, Codable, Hashable, CaseIterable, Sendable {
    case active = "ACTIVE"
    case terminated = "TERMINATED"
}