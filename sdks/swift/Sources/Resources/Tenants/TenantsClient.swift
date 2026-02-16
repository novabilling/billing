import Foundation

public final class TenantsClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve the authenticated tenant's profile including settings and webhook configuration.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getMe(requestOptions: RequestOptions? = nil) async throws -> TenantResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/tenants/me",
            requestOptions: requestOptions,
            responseType: TenantResponse.self
        )
    }

    /// Update tenant profile fields such as company name, webhook URL, or custom settings.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func updateMe(request: Requests.UpdateTenantDto, requestOptions: RequestOptions? = nil) async throws -> TenantResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/tenants/me",
            body: request,
            requestOptions: requestOptions,
            responseType: TenantResponse.self
        )
    }

    /// Retrieve usage metrics including customer count, active subscriptions, and total revenue.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getUsage(requestOptions: RequestOptions? = nil) async throws -> TenantUsageResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/tenants/me/usage",
            requestOptions: requestOptions,
            responseType: TenantUsageResponse.self
        )
    }

    /// Send a test email using the tenant's saved SMTP settings (or system defaults if not configured). Only requires recipient email address.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func testSmtp(request: Requests.TestSmtpTenantsRequest, requestOptions: RequestOptions? = nil) async throws -> MessageResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/tenants/me/smtp/test",
            body: request,
            requestOptions: requestOptions,
            responseType: MessageResponse.self
        )
    }
}