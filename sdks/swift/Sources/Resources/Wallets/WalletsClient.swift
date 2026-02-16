import Foundation

public final class WalletsClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// List wallets, optionally filtered by customer or status.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(customerId: String? = nil, status: ListWalletsRequestStatus? = nil, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedWalletResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/wallets",
            queryParams: [
                "customerId": customerId.map { .string($0) }, 
                "status": status.map { .string($0.rawValue) }, 
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedWalletResponse.self
        )
    }

    /// Create a prepaid credit wallet for a customer. Optionally seed it with paid or granted credits.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreateWalletDto, requestOptions: RequestOptions? = nil) async throws -> WalletResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/wallets",
            body: request,
            requestOptions: requestOptions,
            responseType: WalletResponse.self
        )
    }

    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> WalletResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/wallets/\(id)",
            requestOptions: requestOptions,
            responseType: WalletResponse.self
        )
    }

    /// Terminate a wallet. Remaining credits are voided.
    ///
    /// - Parameter id: Wallet ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> WalletResponse {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/wallets/\(id)",
            requestOptions: requestOptions,
            responseType: WalletResponse.self
        )
    }

    /// Update wallet name, expiration, or metadata.
    ///
    /// - Parameter id: Wallet ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func update(id: String, request: Requests.UpdateWalletDto, requestOptions: RequestOptions? = nil) async throws -> WalletResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/wallets/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: WalletResponse.self
        )
    }

    /// Add paid/granted credits or void existing credits from a wallet.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func createTransaction(request: Requests.TopUpWalletDto, requestOptions: RequestOptions? = nil) async throws -> TopUpResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/wallets/transactions",
            body: request,
            requestOptions: requestOptions,
            responseType: TopUpResponse.self
        )
    }

    public func getTransactions(id: String, status: GetTransactionsWalletsRequestStatus? = nil, transactionStatus: GetTransactionsWalletsRequestTransactionStatus? = nil, transactionType: GetTransactionsWalletsRequestTransactionType? = nil, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedWalletTransactionResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/wallets/\(id)/transactions",
            queryParams: [
                "status": status.map { .string($0.rawValue) }, 
                "transactionStatus": transactionStatus.map { .string($0.rawValue) }, 
                "transactionType": transactionType.map { .string($0.rawValue) }, 
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedWalletTransactionResponse.self
        )
    }
}