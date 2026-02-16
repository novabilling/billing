import Foundation

public struct ProviderTestResponse: Codable, Hashable, Sendable {
    public let success: Bool
    public let message: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        success: Bool,
        message: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.success = success
        self.message = message
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.success = try container.decode(Bool.self, forKey: .success)
        self.message = try container.decode(String.self, forKey: .message)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.success, forKey: .success)
        try container.encode(self.message, forKey: .message)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case success
        case message
    }
}