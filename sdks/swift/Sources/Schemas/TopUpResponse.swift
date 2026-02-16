import Foundation

public struct TopUpResponse: Codable, Hashable, Sendable {
    public let transactions: [WalletTransactionResponse]
    public let wallet: WalletResponse
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        transactions: [WalletTransactionResponse],
        wallet: WalletResponse,
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.transactions = transactions
        self.wallet = wallet
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.transactions = try container.decode([WalletTransactionResponse].self, forKey: .transactions)
        self.wallet = try container.decode(WalletResponse.self, forKey: .wallet)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.transactions, forKey: .transactions)
        try container.encode(self.wallet, forKey: .wallet)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case transactions
        case wallet
    }
}