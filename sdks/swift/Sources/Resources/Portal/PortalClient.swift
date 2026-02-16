import Foundation

public final class PortalClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Returns subscriptions, recent invoices, payments, and summary stats for a customer. Use this to render a billing dashboard for your end-users.
    ///
    /// - Parameter externalId: Customer external ID (your app user ID)
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getBilling(externalId: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/portal/customers/\(externalId)/billing",
            requestOptions: requestOptions
        )
    }

    /// Returns all subscriptions for the customer with plan details.
    ///
    /// - Parameter externalId: Customer external ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getSubscriptions(externalId: String, requestOptions: RequestOptions? = nil) async throws -> [SubscriptionResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/portal/customers/\(externalId)/subscriptions",
            requestOptions: requestOptions,
            responseType: [SubscriptionResponse].self
        )
    }

    /// Returns a paginated list of invoices. Filter by status to show only pending invoices.
    ///
    /// - Parameter externalId: Customer external ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getInvoices(externalId: String, status: GetInvoicesPortalRequestStatus? = nil, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedInvoiceResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/portal/customers/\(externalId)/invoices",
            queryParams: [
                "status": status.map { .string($0.rawValue) }, 
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedInvoiceResponse.self
        )
    }

    /// Initiates a payment session with the configured payment provider. Returns a checkout URL to redirect the customer to.
    ///
    /// - Parameter externalId: Customer external ID
    /// - Parameter invoiceId: Invoice ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func createCheckout(externalId: String, invoiceId: String, requestOptions: RequestOptions? = nil) async throws -> CheckoutResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/portal/customers/\(externalId)/invoices/\(invoiceId)/checkout",
            requestOptions: requestOptions,
            responseType: CheckoutResponse.self
        )
    }

    /// Returns a paginated list of all payments made by the customer.
    ///
    /// - Parameter externalId: Customer external ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getPayments(externalId: String, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedPaymentResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/portal/customers/\(externalId)/payments",
            queryParams: [
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedPaymentResponse.self
        )
    }
}