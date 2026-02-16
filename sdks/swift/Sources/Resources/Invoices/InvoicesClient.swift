import Foundation

public final class InvoicesClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve a paginated list of invoices. Supports filtering by status, customer, and date range.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(status: String? = nil, customerId: String? = nil, dateFrom: String? = nil, dateTo: String? = nil, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedInvoiceResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/invoices",
            queryParams: [
                "status": status.map { .string($0) }, 
                "customerId": customerId.map { .string($0) }, 
                "dateFrom": dateFrom.map { .string($0) }, 
                "dateTo": dateTo.map { .string($0) }, 
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedInvoiceResponse.self
        )
    }

    /// Create a draft invoice with line items. The total amount is automatically calculated from the items.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreateInvoiceDto, requestOptions: RequestOptions? = nil) async throws -> InvoiceResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/invoices",
            body: request,
            requestOptions: requestOptions,
            responseType: InvoiceResponse.self
        )
    }

    /// Retrieve detailed invoice information including associated customer, subscription, and payments.
    ///
    /// - Parameter id: Invoice ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> InvoiceResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/invoices/\(id)",
            requestOptions: requestOptions,
            responseType: InvoiceResponse.self
        )
    }

    /// Move an invoice from draft to pending status, making it ready for payment.
    ///
    /// - Parameter id: Invoice ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func finalize(id: String, requestOptions: RequestOptions? = nil) async throws -> InvoiceResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/invoices/\(id)/finalize",
            requestOptions: requestOptions,
            responseType: InvoiceResponse.self
        )
    }

    /// Cancel an unpaid invoice. Paid invoices cannot be voided — use a refund instead.
    ///
    /// - Parameter id: Invoice ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func void(id: String, requestOptions: RequestOptions? = nil) async throws -> InvoiceResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/invoices/\(id)/void",
            requestOptions: requestOptions,
            responseType: InvoiceResponse.self
        )
    }

    /// Record an offline or manual payment against an invoice. Accepts an optional paymentMethod (e.g. "cash", "bank_transfer", "check", "manual").
    ///
    /// - Parameter id: Invoice ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func markPaid(id: String, request: Requests.MarkPaidInvoicesRequest, requestOptions: RequestOptions? = nil) async throws -> InvoiceResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/invoices/\(id)/mark-paid",
            body: request,
            requestOptions: requestOptions,
            responseType: InvoiceResponse.self
        )
    }

    /// Initiate a payment session with the configured payment provider (Stripe, Paystack, Flutterwave, or M-Pesa). Returns a checkout URL that redirects the customer to the provider's hosted payment page.
    ///
    /// - Parameter id: Invoice ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func createCheckout(id: String, request: Requests.CreateCheckoutInvoicesRequest, requestOptions: RequestOptions? = nil) async throws -> CheckoutResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/invoices/\(id)/checkout",
            body: request,
            requestOptions: requestOptions,
            responseType: CheckoutResponse.self
        )
    }

    /// Send the invoice to a specified email address, or to the customer's email if none is provided.
    ///
    /// - Parameter id: Invoice ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func sendEmail(id: String, request: Requests.SendEmailInvoicesRequest, requestOptions: RequestOptions? = nil) async throws -> MessageResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/invoices/\(id)/send-email",
            body: request,
            requestOptions: requestOptions,
            responseType: MessageResponse.self
        )
    }

    /// Returns the PDF binary for the invoice. If a PDF has not been generated yet, it will be created on-demand.
    ///
    /// - Parameter id: Invoice ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getPdf(id: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/invoices/\(id)/pdf",
            requestOptions: requestOptions
        )
    }
}