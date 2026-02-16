import Foundation

public final class ChargesClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve all charges, optionally filtered by plan ID.
    ///
    /// - Parameter planId: Filter by plan ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(planId: String? = nil, requestOptions: RequestOptions? = nil) async throws -> [ChargeResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/charges",
            queryParams: [
                "planId": planId.map { .string($0) }
            ],
            requestOptions: requestOptions,
            responseType: [ChargeResponse].self
        )
    }

    /// Create a usage-based charge linking a plan to a billable metric. Supported models: STANDARD, GRADUATED, VOLUME, PACKAGE, PERCENTAGE.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreateChargeDto, requestOptions: RequestOptions? = nil) async throws -> ChargeResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/charges",
            body: request,
            requestOptions: requestOptions,
            responseType: ChargeResponse.self
        )
    }

    /// Retrieve a charge with its billable metric, graduated ranges, and filters.
    ///
    /// - Parameter id: Charge ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> ChargeResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/charges/\(id)",
            requestOptions: requestOptions,
            responseType: ChargeResponse.self
        )
    }

    /// Remove a charge from a plan.
    ///
    /// - Parameter id: Charge ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> ChargeResponse {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/charges/\(id)",
            requestOptions: requestOptions,
            responseType: ChargeResponse.self
        )
    }

    /// Update charge configuration including pricing, ranges, and filters.
    ///
    /// - Parameter id: Charge ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func update(id: String, request: Requests.UpdateChargeDto, requestOptions: RequestOptions? = nil) async throws -> ChargeResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/charges/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: ChargeResponse.self
        )
    }

    /// Retrieve all charges attached to a specific plan.
    ///
    /// - Parameter planId: Plan ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getByPlan(planId: String, requestOptions: RequestOptions? = nil) async throws -> [ChargeResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/charges/plan/\(planId)",
            requestOptions: requestOptions,
            responseType: [ChargeResponse].self
        )
    }
}