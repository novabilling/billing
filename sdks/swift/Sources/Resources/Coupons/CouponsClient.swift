import Foundation

public final class CouponsClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve a paginated list of coupons.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(isActive: Bool? = nil, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedCouponResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/coupons",
            queryParams: [
                "isActive": isActive.map { .bool($0) }, 
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedCouponResponse.self
        )
    }

    /// Create a new discount coupon.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreateCouponDto, requestOptions: RequestOptions? = nil) async throws -> CouponResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/coupons",
            body: request,
            requestOptions: requestOptions,
            responseType: CouponResponse.self
        )
    }

    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> CouponResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/coupons/\(id)",
            requestOptions: requestOptions,
            responseType: CouponResponse.self
        )
    }

    /// Delete or deactivate a coupon.
    ///
    /// - Parameter id: Coupon ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> CouponResponse {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/coupons/\(id)",
            requestOptions: requestOptions,
            responseType: CouponResponse.self
        )
    }

    public func update(id: String, request: Requests.UpdateCouponDto, requestOptions: RequestOptions? = nil) async throws -> CouponResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/coupons/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: CouponResponse.self
        )
    }

    /// Apply a coupon to a specific customer, optionally linked to a subscription.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func apply(request: Requests.ApplyCouponDto, requestOptions: RequestOptions? = nil) async throws -> AppliedCouponResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/coupons/apply",
            body: request,
            requestOptions: requestOptions,
            responseType: AppliedCouponResponse.self
        )
    }

    public func removeApplied(id: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/coupons/applied/\(id)",
            requestOptions: requestOptions
        )
    }
}