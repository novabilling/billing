import Foundation

public final class TaxesClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    public func list(appliedByDefault: Bool? = nil, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedTaxResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/taxes",
            queryParams: [
                "appliedByDefault": appliedByDefault.map { .bool($0) }, 
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedTaxResponse.self
        )
    }

    /// Create a new tax rate. Set appliedByDefault to automatically apply to all invoices.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreateTaxDto, requestOptions: RequestOptions? = nil) async throws -> TaxResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/taxes",
            body: request,
            requestOptions: requestOptions,
            responseType: TaxResponse.self
        )
    }

    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> TaxResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/taxes/\(id)",
            requestOptions: requestOptions,
            responseType: TaxResponse.self
        )
    }

    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/taxes/\(id)",
            requestOptions: requestOptions
        )
    }

    public func update(id: String, request: Requests.UpdateTaxDto, requestOptions: RequestOptions? = nil) async throws -> TaxResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/taxes/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: TaxResponse.self
        )
    }

    public func taxesControllerGetCustomerTaxes(customerId: String, requestOptions: RequestOptions? = nil) async throws -> [TaxResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/taxes/customer/\(customerId)",
            requestOptions: requestOptions,
            responseType: [TaxResponse].self
        )
    }

    public func assignToCustomer(customerId: String, request: AssignTaxDto, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/taxes/customer/\(customerId)",
            body: request,
            requestOptions: requestOptions
        )
    }

    public func removeFromCustomer(customerId: String, taxId: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/taxes/customer/\(customerId)/\(taxId)",
            requestOptions: requestOptions
        )
    }

    public func taxesControllerGetPlanTaxes(planId: String, requestOptions: RequestOptions? = nil) async throws -> [TaxResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/taxes/plan/\(planId)",
            requestOptions: requestOptions,
            responseType: [TaxResponse].self
        )
    }

    public func assignToPlan(planId: String, request: AssignTaxDto, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/taxes/plan/\(planId)",
            body: request,
            requestOptions: requestOptions
        )
    }

    public func removeFromPlan(planId: String, taxId: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/taxes/plan/\(planId)/\(taxId)",
            requestOptions: requestOptions
        )
    }

    public func assignToCharge(chargeId: String, request: AssignTaxDto, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/taxes/charge/\(chargeId)",
            body: request,
            requestOptions: requestOptions
        )
    }

    public func removeFromCharge(chargeId: String, taxId: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/taxes/charge/\(chargeId)/\(taxId)",
            requestOptions: requestOptions
        )
    }
}