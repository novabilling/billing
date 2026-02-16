import Foundation

public final class EventsClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    public func list(requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/events",
            requestOptions: requestOptions
        )
    }

    /// Send a single usage event. Uses transactionId for idempotency - sending the same transactionId twice will return the existing event.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: CreateEventDto, requestOptions: RequestOptions? = nil) async throws -> UsageEventResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/events",
            body: request,
            requestOptions: requestOptions,
            responseType: UsageEventResponse.self
        )
    }

    /// Send up to 100 usage events in a single request. Each event is processed independently - failures do not affect other events.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func createBatch(request: Requests.BatchEventsDto, requestOptions: RequestOptions? = nil) async throws -> BatchEventResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/events/batch",
            body: request,
            requestOptions: requestOptions,
            responseType: BatchEventResponse.self
        )
    }

    /// Retrieve a single usage event by its ID.
    ///
    /// - Parameter id: Event ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> UsageEventResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/events/\(id)",
            requestOptions: requestOptions,
            responseType: UsageEventResponse.self
        )
    }

    /// Retrieve usage events for a specific subscription with optional filtering.
    ///
    /// - Parameter subscriptionId: Subscription ID
    /// - Parameter code: Filter by metric code
    /// - Parameter from: Start date (ISO 8601)
    /// - Parameter to: End date (ISO 8601)
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getBySubscription(subscriptionId: String, code: String? = nil, from: String? = nil, to: String? = nil, page: Double? = nil, perPage: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedUsageEventResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/events/subscription/\(subscriptionId)",
            queryParams: [
                "code": code.map { .string($0) }, 
                "from": from.map { .string($0) }, 
                "to": to.map { .string($0) }, 
                "page": page.map { .double($0) }, 
                "perPage": perPage.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedUsageEventResponse.self
        )
    }
}