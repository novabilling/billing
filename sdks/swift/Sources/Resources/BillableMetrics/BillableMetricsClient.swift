import Foundation

public final class BillableMetricsClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve all billable metrics with their filters and charge counts.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(requestOptions: RequestOptions? = nil) async throws -> [BillableMetricResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/billable-metrics",
            requestOptions: requestOptions,
            responseType: [BillableMetricResponse].self
        )
    }

    /// Create a new billable metric for usage-based billing. Supported aggregation types: COUNT, SUM, MAX, UNIQUE_COUNT, LATEST, WEIGHTED_SUM.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreateBillableMetricDto, requestOptions: RequestOptions? = nil) async throws -> BillableMetricResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/billable-metrics",
            body: request,
            requestOptions: requestOptions,
            responseType: BillableMetricResponse.self
        )
    }

    /// Retrieve a billable metric with its filters and associated charges.
    ///
    /// - Parameter id: Billable Metric ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> BillableMetricResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/billable-metrics/\(id)",
            requestOptions: requestOptions,
            responseType: BillableMetricResponse.self
        )
    }

    /// Delete a billable metric. Metrics used in charges cannot be deleted.
    ///
    /// - Parameter id: Billable Metric ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> BillableMetricResponse {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/billable-metrics/\(id)",
            requestOptions: requestOptions,
            responseType: BillableMetricResponse.self
        )
    }

    /// Update billable metric details. Code and aggregation type cannot be changed.
    ///
    /// - Parameter id: Billable Metric ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func update(id: String, request: Requests.UpdateBillableMetricDto, requestOptions: RequestOptions? = nil) async throws -> BillableMetricResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/billable-metrics/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: BillableMetricResponse.self
        )
    }
}