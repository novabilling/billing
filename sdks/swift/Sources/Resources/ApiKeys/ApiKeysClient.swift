import Foundation

public final class ApiKeysClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve all API keys for the tenant. Keys are masked for security — only the last 8 characters are shown.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(requestOptions: RequestOptions? = nil) async throws -> [ApiKeyResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/tenants/me/api-keys",
            requestOptions: requestOptions,
            responseType: [ApiKeyResponse].self
        )
    }

    /// Generate a new API key with specified scopes. The full key is returned only once in the response — store it securely.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreateApiKeyBodyDto, requestOptions: RequestOptions? = nil) async throws -> ApiKeyResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/tenants/me/api-keys",
            body: request,
            requestOptions: requestOptions,
            responseType: ApiKeyResponse.self
        )
    }

    /// Permanently revoke an API key. Any requests using this key will immediately fail.
    ///
    /// - Parameter id: API key ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/tenants/me/api-keys/\(id)",
            requestOptions: requestOptions
        )
    }
}