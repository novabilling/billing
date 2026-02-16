import Foundation

public final class CurrenciesClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve all supported currencies with their symbols and metadata.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(requestOptions: RequestOptions? = nil) async throws -> [CurrencyResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/currencies",
            requestOptions: requestOptions,
            responseType: [CurrencyResponse].self
        )
    }
}