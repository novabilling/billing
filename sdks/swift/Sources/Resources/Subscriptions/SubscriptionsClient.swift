import Foundation

public final class SubscriptionsClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve a paginated list of subscriptions. Supports filtering by status, customer, and plan.
    ///
    /// - Parameter status: Filter by status (ACTIVE, TRIALING, PAUSED, CANCELED)
    /// - Parameter customerId: Filter by customer ID
    /// - Parameter planId: Filter by plan ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(status: String? = nil, customerId: String? = nil, planId: String? = nil, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedSubscriptionResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/subscriptions",
            queryParams: [
                "status": status.map { .string($0) }, 
                "customerId": customerId.map { .string($0) }, 
                "planId": planId.map { .string($0) }, 
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedSubscriptionResponse.self
        )
    }

    /// Subscribe a customer to a plan. The plan must have a price matching the specified currency. Optionally set a trial period in days.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreateSubscriptionDto, requestOptions: RequestOptions? = nil) async throws -> SubscriptionResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/subscriptions",
            body: request,
            requestOptions: requestOptions,
            responseType: SubscriptionResponse.self
        )
    }

    /// Retrieve detailed subscription information including customer, plan with prices, and recent invoices.
    ///
    /// - Parameter id: Subscription ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> SubscriptionResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/subscriptions/\(id)",
            requestOptions: requestOptions,
            responseType: SubscriptionResponse.self
        )
    }

    /// Update the metadata field on a subscription. Other fields cannot be changed directly.
    ///
    /// - Parameter id: Subscription ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func update(id: String, request: Requests.UpdateSubscriptionDto, requestOptions: RequestOptions? = nil) async throws -> SubscriptionResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/subscriptions/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: SubscriptionResponse.self
        )
    }

    /// Cancel a subscription either immediately or at the end of the current billing period. When set to "period_end", the subscription remains active until the current period expires.
    ///
    /// - Parameter id: Subscription ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func cancel(id: String, request: Requests.CancelSubscriptionDto, requestOptions: RequestOptions? = nil) async throws -> SubscriptionResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/subscriptions/\(id)/cancel",
            body: request,
            requestOptions: requestOptions,
            responseType: SubscriptionResponse.self
        )
    }

    /// Temporarily pause an active subscription. Only active subscriptions can be paused.
    ///
    /// - Parameter id: Subscription ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func pause(id: String, requestOptions: RequestOptions? = nil) async throws -> SubscriptionResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/subscriptions/\(id)/pause",
            requestOptions: requestOptions,
            responseType: SubscriptionResponse.self
        )
    }

    /// Resume a previously paused subscription back to active status.
    ///
    /// - Parameter id: Subscription ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func resume(id: String, requestOptions: RequestOptions? = nil) async throws -> SubscriptionResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/subscriptions/\(id)/resume",
            requestOptions: requestOptions,
            responseType: SubscriptionResponse.self
        )
    }

    /// Switch a subscription to a different plan. The new plan must have a price for the subscription's currency. A new billing period starts immediately with the new plan.
    ///
    /// - Parameter id: Subscription ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func changePlan(id: String, request: Requests.ChangePlanDto, requestOptions: RequestOptions? = nil) async throws -> SubscriptionResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/subscriptions/\(id)/change-plan",
            body: request,
            requestOptions: requestOptions,
            responseType: SubscriptionResponse.self
        )
    }
}