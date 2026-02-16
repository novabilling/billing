import Foundation

public final class CustomersClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve a paginated list of customers. Supports filtering by search term, country, and currency.
    ///
    /// - Parameter search: Search by name or email
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(page: Double? = nil, limit: Double? = nil, search: String? = nil, country: String? = nil, currency: String? = nil, sortBy: String? = nil, sortOrder: ListCustomersRequestSortOrder? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedCustomerResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/customers",
            queryParams: [
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }, 
                "search": search.map { .string($0) }, 
                "country": country.map { .string($0) }, 
                "currency": currency.map { .string($0) }, 
                "sortBy": sortBy.map { .string($0) }, 
                "sortOrder": sortOrder.map { .string($0.rawValue) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedCustomerResponse.self
        )
    }

    /// Create a customer record. The externalId should be unique and map to your application's user ID.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreateCustomerDto, requestOptions: RequestOptions? = nil) async throws -> CustomerResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/customers",
            body: request,
            requestOptions: requestOptions,
            responseType: CustomerResponse.self
        )
    }

    /// Retrieve detailed information about a specific customer including their billing history summary.
    ///
    /// - Parameter id: Customer ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> CustomerResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/customers/\(id)",
            requestOptions: requestOptions,
            responseType: CustomerResponse.self
        )
    }

    /// Permanently delete a customer. Fails if the customer has active subscriptions.
    ///
    /// - Parameter id: Customer ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/customers/\(id)",
            requestOptions: requestOptions
        )
    }

    /// Update customer fields. Only provided fields will be changed.
    ///
    /// - Parameter id: Customer ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func update(id: String, request: Requests.UpdateCustomerDto, requestOptions: RequestOptions? = nil) async throws -> CustomerResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/customers/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: CustomerResponse.self
        )
    }

    /// Retrieve all subscriptions for a specific customer.
    ///
    /// - Parameter id: Customer ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getSubscriptions(id: String, requestOptions: RequestOptions? = nil) async throws -> [SubscriptionResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/customers/\(id)/subscriptions",
            requestOptions: requestOptions,
            responseType: [SubscriptionResponse].self
        )
    }

    /// Retrieve all invoices for a specific customer.
    ///
    /// - Parameter id: Customer ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getInvoices(id: String, requestOptions: RequestOptions? = nil) async throws -> [InvoiceResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/customers/\(id)/invoices",
            requestOptions: requestOptions,
            responseType: [InvoiceResponse].self
        )
    }

    /// Retrieve all payments made by a specific customer.
    ///
    /// - Parameter id: Customer ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getPayments(id: String, requestOptions: RequestOptions? = nil) async throws -> [PaymentResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/customers/\(id)/payments",
            requestOptions: requestOptions,
            responseType: [PaymentResponse].self
        )
    }

    /// Retrieve saved payment methods (cards, tokens) for a customer.
    ///
    /// - Parameter id: Customer ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getPaymentMethods(id: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/customers/\(id)/payment-methods",
            requestOptions: requestOptions
        )
    }

    public func addPaymentMethod(id: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/customers/\(id)/payment-methods",
            requestOptions: requestOptions
        )
    }

    /// Remove a saved payment method from a customer.
    ///
    /// - Parameter id: Customer ID
    /// - Parameter methodId: Payment method ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func deletePaymentMethod(id: String, methodId: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/customers/\(id)/payment-methods/\(methodId)",
            requestOptions: requestOptions
        )
    }
}