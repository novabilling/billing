import Foundation

public final class PaymentsClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve a paginated list of payments. Supports filtering by status, provider, invoice, and date range.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(status: String? = nil, provider: String? = nil, invoiceId: String? = nil, dateFrom: String? = nil, dateTo: String? = nil, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedPaymentResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/payments",
            queryParams: [
                "status": status.map { .string($0) }, 
                "provider": provider.map { .string($0) }, 
                "invoiceId": invoiceId.map { .string($0) }, 
                "dateFrom": dateFrom.map { .string($0) }, 
                "dateTo": dateTo.map { .string($0) }, 
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedPaymentResponse.self
        )
    }

    /// Create a payment record manually. Useful for importing historical data. If status is SUCCEEDED, the associated invoice will also be marked as paid.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func paymentsControllerCreate(request: Requests.CreatePaymentDto, requestOptions: RequestOptions? = nil) async throws -> PaymentResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/payments",
            body: request,
            requestOptions: requestOptions,
            responseType: PaymentResponse.self
        )
    }

    /// Retrieve detailed payment information including the associated invoice and customer.
    ///
    /// - Parameter id: Payment ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> PaymentResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/payments/\(id)",
            requestOptions: requestOptions,
            responseType: PaymentResponse.self
        )
    }

    /// Issue a full or partial refund for a succeeded payment. If amount is omitted, the full payment amount is refunded.
    ///
    /// - Parameter id: Payment ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func refund(id: String, request: Requests.RefundPaymentDto, requestOptions: RequestOptions? = nil) async throws -> PaymentResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/payments/\(id)/refund",
            body: request,
            requestOptions: requestOptions,
            responseType: PaymentResponse.self
        )
    }
}