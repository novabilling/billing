import Foundation

public final class PlanOverridesClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// List all plan overrides, optionally filtered by customerId or planId
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(customerId: String? = nil, planId: String? = nil, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedPlanOverrideResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/plan-overrides",
            queryParams: [
                "customerId": customerId.map { .string($0) }, 
                "planId": planId.map { .string($0) }, 
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedPlanOverrideResponse.self
        )
    }

    /// Create a customer-specific override for a plan (custom pricing, minimum commitment, or charge properties)
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreatePlanOverrideDto, requestOptions: RequestOptions? = nil) async throws -> PlanOverrideResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/plan-overrides",
            body: request,
            requestOptions: requestOptions,
            responseType: PlanOverrideResponse.self
        )
    }

    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> PlanOverrideResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/plan-overrides/\(id)",
            requestOptions: requestOptions,
            responseType: PlanOverrideResponse.self
        )
    }

    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/plan-overrides/\(id)",
            requestOptions: requestOptions
        )
    }

    public func update(id: String, request: Requests.UpdatePlanOverrideDto, requestOptions: RequestOptions? = nil) async throws -> PlanOverrideResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/plan-overrides/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: PlanOverrideResponse.self
        )
    }
}