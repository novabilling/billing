import Foundation

public struct CheckoutResponse: Codable, Hashable, Sendable {
    public let checkoutUrl: String
    public let paymentId: String
    public let provider: String
    public let expiresAt: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        checkoutUrl: String,
        paymentId: String,
        provider: String,
        expiresAt: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.checkoutUrl = checkoutUrl
        self.paymentId = paymentId
        self.provider = provider
        self.expiresAt = expiresAt
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.checkoutUrl = try container.decode(String.self, forKey: .checkoutUrl)
        self.paymentId = try container.decode(String.self, forKey: .paymentId)
        self.provider = try container.decode(String.self, forKey: .provider)
        self.expiresAt = try container.decode(String.self, forKey: .expiresAt)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.checkoutUrl, forKey: .checkoutUrl)
        try container.encode(self.paymentId, forKey: .paymentId)
        try container.encode(self.provider, forKey: .provider)
        try container.encode(self.expiresAt, forKey: .expiresAt)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case checkoutUrl
        case paymentId
        case provider
        case expiresAt
    }
}