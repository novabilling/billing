import Foundation

public final class AddOnsClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve a paginated list of add-ons with prices.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedAddOnResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/add-ons",
            queryParams: [
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedAddOnResponse.self
        )
    }

    /// Create a one-time charge add-on with multi-currency pricing.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreateAddOnDto, requestOptions: RequestOptions? = nil) async throws -> AddOnResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/add-ons",
            body: request,
            requestOptions: requestOptions,
            responseType: AddOnResponse.self
        )
    }

    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> AddOnResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/add-ons/\(id)",
            requestOptions: requestOptions,
            responseType: AddOnResponse.self
        )
    }

    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> AddOnResponse {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/add-ons/\(id)",
            requestOptions: requestOptions,
            responseType: AddOnResponse.self
        )
    }

    public func update(id: String, request: Requests.UpdateAddOnDto, requestOptions: RequestOptions? = nil) async throws -> AddOnResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/add-ons/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: AddOnResponse.self
        )
    }

    /// Create a one-time charge for a customer. Will be included in the next invoice.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func apply(request: Requests.ApplyAddOnDto, requestOptions: RequestOptions? = nil) async throws -> AppliedAddOnResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/add-ons/apply",
            body: request,
            requestOptions: requestOptions,
            responseType: AppliedAddOnResponse.self
        )
    }

    /// View one-time charges applied to customers.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func listApplied(customerId: String? = nil, invoiced: Bool? = nil, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> [AppliedAddOnResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/add-ons/applied/list",
            queryParams: [
                "customerId": customerId.map { .string($0) }, 
                "invoiced": invoiced.map { .bool($0) }, 
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: [AppliedAddOnResponse].self
        )
    }

    /// Remove a one-time charge that has not yet been invoiced.
    ///
    /// - Parameter id: Applied add-on ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func removeApplied(id: String, requestOptions: RequestOptions? = nil) async throws -> AppliedAddOnResponse {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/add-ons/applied/\(id)",
            requestOptions: requestOptions,
            responseType: AppliedAddOnResponse.self
        )
    }
}