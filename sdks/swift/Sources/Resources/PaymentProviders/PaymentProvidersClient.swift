import Foundation

public final class PaymentProvidersClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve all configured payment providers for the tenant. Credentials are never returned.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(requestOptions: RequestOptions? = nil) async throws -> [PaymentProviderResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/payment-providers",
            requestOptions: requestOptions,
            responseType: [PaymentProviderResponse].self
        )
    }

    /// Set up a payment provider (stripe, paystack, flutterwave, or mpesa) with encrypted credentials. The provider with the lowest priority number is used by default for checkout.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func configure(request: Requests.CreateProviderDto, requestOptions: RequestOptions? = nil) async throws -> PaymentProviderResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/payment-providers",
            body: request,
            requestOptions: requestOptions,
            responseType: PaymentProviderResponse.self
        )
    }

    /// Retrieve a specific payment provider configuration. Credentials are not included.
    ///
    /// - Parameter id: Payment provider ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> PaymentProviderResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/payment-providers/\(id)",
            requestOptions: requestOptions,
            responseType: PaymentProviderResponse.self
        )
    }

    /// Remove a payment provider configuration. This does not affect existing payments.
    ///
    /// - Parameter id: Payment provider ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> PaymentProviderResponse {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/payment-providers/\(id)",
            requestOptions: requestOptions,
            responseType: PaymentProviderResponse.self
        )
    }

    /// Update provider settings such as active status, priority, or credentials.
    ///
    /// - Parameter id: Payment provider ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func update(id: String, request: Requests.UpdateProviderDto, requestOptions: RequestOptions? = nil) async throws -> PaymentProviderResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/payment-providers/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: PaymentProviderResponse.self
        )
    }

    /// Verify that the provider credentials are valid by making a test API call to the provider.
    ///
    /// - Parameter id: Payment provider ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func testConnection(id: String, requestOptions: RequestOptions? = nil) async throws -> ProviderTestResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/payment-providers/\(id)/test",
            requestOptions: requestOptions,
            responseType: ProviderTestResponse.self
        )
    }
}