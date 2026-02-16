import Foundation

public struct RegisterResponse: Codable, Hashable, Sendable {
    public let accessToken: String
    public let refreshToken: String
    public let tenant: TenantInfoResponse
    public let apiKey: String
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        accessToken: String,
        refreshToken: String,
        tenant: TenantInfoResponse,
        apiKey: String,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.accessToken = accessToken
        self.refreshToken = refreshToken
        self.tenant = tenant
        self.apiKey = apiKey
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.accessToken = try container.decode(String.self, forKey: .accessToken)
        self.refreshToken = try container.decode(String.self, forKey: .refreshToken)
        self.tenant = try container.decode(TenantInfoResponse.self, forKey: .tenant)
        self.apiKey = try container.decode(String.self, forKey: .apiKey)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.accessToken, forKey: .accessToken)
        try container.encode(self.refreshToken, forKey: .refreshToken)
        try container.encode(self.tenant, forKey: .tenant)
        try container.encode(self.apiKey, forKey: .apiKey)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case accessToken
        case refreshToken
        case tenant
        case apiKey
    }
}