import Foundation

public final class PlansClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve all billing plans with their prices. Optionally filter by active status.
    ///
    /// - Parameter isActive: Filter by active status
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(isActive: Bool? = nil, requestOptions: RequestOptions? = nil) async throws -> [PlanResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/plans",
            queryParams: [
                "isActive": isActive.map { .bool($0) }
            ],
            requestOptions: requestOptions,
            responseType: [PlanResponse].self
        )
    }

    /// Create a billing plan with a unique code. Optionally include prices for different currencies. Plans can have MONTHLY, QUARTERLY, or YEARLY billing intervals.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreatePlanDto, requestOptions: RequestOptions? = nil) async throws -> PlanResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/plans",
            body: request,
            requestOptions: requestOptions,
            responseType: PlanResponse.self
        )
    }

    /// Retrieve a plan with all its prices and features.
    ///
    /// - Parameter id: Plan ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> PlanResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/plans/\(id)",
            requestOptions: requestOptions,
            responseType: PlanResponse.self
        )
    }

    /// Delete a billing plan. Plans with active subscriptions should be deactivated instead.
    ///
    /// - Parameter id: Plan ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> PlanResponse {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/plans/\(id)",
            requestOptions: requestOptions,
            responseType: PlanResponse.self
        )
    }

    /// Update plan details like name, description, features, or billing interval.
    ///
    /// - Parameter id: Plan ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func update(id: String, request: Requests.UpdatePlanDto, requestOptions: RequestOptions? = nil) async throws -> PlanResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/plans/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: PlanResponse.self
        )
    }

    /// Add a price in a specific currency to a plan. Each plan can have one price per currency.
    ///
    /// - Parameter id: Plan ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func addPrice(id: String, request: CreatePlanPriceDto, requestOptions: RequestOptions? = nil) async throws -> PlanPriceResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/plans/\(id)/prices",
            body: request,
            requestOptions: requestOptions,
            responseType: PlanPriceResponse.self
        )
    }

    /// Remove a price from a plan. Active subscriptions using this price will not be affected.
    ///
    /// - Parameter id: Plan ID
    /// - Parameter priceId: Price ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func deletePrice(id: String, priceId: String, requestOptions: RequestOptions? = nil) async throws -> PlanPriceResponse {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/plans/\(id)/prices/\(priceId)",
            requestOptions: requestOptions,
            responseType: PlanPriceResponse.self
        )
    }

    /// Change the amount for an existing price on a plan.
    ///
    /// - Parameter id: Plan ID
    /// - Parameter priceId: Price ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func updatePrice(id: String, priceId: String, requestOptions: RequestOptions? = nil) async throws -> PlanPriceResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/plans/\(id)/prices/\(priceId)",
            requestOptions: requestOptions,
            responseType: PlanPriceResponse.self
        )
    }
}