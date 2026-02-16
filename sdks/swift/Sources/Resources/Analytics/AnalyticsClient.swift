import Foundation

public final class AnalyticsClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve revenue metrics including total revenue, MRR (monthly recurring revenue), and revenue breakdown by period. Supports filtering by date range and currency.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getRevenue(dateFrom: String? = nil, dateTo: String? = nil, currency: String? = nil, groupBy: GetRevenueAnalyticsRequestGroupBy? = nil, requestOptions: RequestOptions? = nil) async throws -> RevenueAnalyticsResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/analytics/revenue",
            queryParams: [
                "dateFrom": dateFrom.map { .string($0) }, 
                "dateTo": dateTo.map { .string($0) }, 
                "currency": currency.map { .string($0) }, 
                "groupBy": groupBy.map { .string($0.rawValue) }
            ],
            requestOptions: requestOptions,
            responseType: RevenueAnalyticsResponse.self
        )
    }

    /// Retrieve subscription metrics including active count, churn rate, new subscriptions, and status distribution.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getSubscriptions(dateFrom: String? = nil, dateTo: String? = nil, currency: String? = nil, groupBy: GetSubscriptionsAnalyticsRequestGroupBy? = nil, requestOptions: RequestOptions? = nil) async throws -> SubscriptionAnalyticsResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/analytics/subscriptions",
            queryParams: [
                "dateFrom": dateFrom.map { .string($0) }, 
                "dateTo": dateTo.map { .string($0) }, 
                "currency": currency.map { .string($0) }, 
                "groupBy": groupBy.map { .string($0.rawValue) }
            ],
            requestOptions: requestOptions,
            responseType: SubscriptionAnalyticsResponse.self
        )
    }

    /// Retrieve customer metrics including total count, new customers, and geographic distribution.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getCustomers(dateFrom: String? = nil, dateTo: String? = nil, currency: String? = nil, groupBy: GetCustomersAnalyticsRequestGroupBy? = nil, requestOptions: RequestOptions? = nil) async throws -> CustomerAnalyticsResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/analytics/customers",
            queryParams: [
                "dateFrom": dateFrom.map { .string($0) }, 
                "dateTo": dateTo.map { .string($0) }, 
                "currency": currency.map { .string($0) }, 
                "groupBy": groupBy.map { .string($0.rawValue) }
            ],
            requestOptions: requestOptions,
            responseType: CustomerAnalyticsResponse.self
        )
    }

    /// Retrieve payment metrics including success rate, failure rate, total volume, and breakdown by payment provider.
    ///
    /// - Parameter provider: Filter by payment provider name
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getPayments(dateFrom: String? = nil, dateTo: String? = nil, currency: String? = nil, groupBy: GetPaymentsAnalyticsRequestGroupBy? = nil, provider: String? = nil, requestOptions: RequestOptions? = nil) async throws -> PaymentAnalyticsResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/analytics/payments",
            queryParams: [
                "dateFrom": dateFrom.map { .string($0) }, 
                "dateTo": dateTo.map { .string($0) }, 
                "currency": currency.map { .string($0) }, 
                "groupBy": groupBy.map { .string($0.rawValue) }, 
                "provider": provider.map { .string($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaymentAnalyticsResponse.self
        )
    }

    /// MRR breakdown by movement type (new, expansion, contraction, churn) and by plan.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getMrrBreakdown(dateFrom: String? = nil, dateTo: String? = nil, currency: String? = nil, groupBy: GetMrrBreakdownAnalyticsRequestGroupBy? = nil, requestOptions: RequestOptions? = nil) async throws -> MrrBreakdownResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/analytics/mrr-breakdown",
            queryParams: [
                "dateFrom": dateFrom.map { .string($0) }, 
                "dateTo": dateTo.map { .string($0) }, 
                "currency": currency.map { .string($0) }, 
                "groupBy": groupBy.map { .string($0.rawValue) }
            ],
            requestOptions: requestOptions,
            responseType: MrrBreakdownResponse.self
        )
    }

    /// Gross revenue minus refunds and credit notes.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getNetRevenue(dateFrom: String? = nil, dateTo: String? = nil, currency: String? = nil, groupBy: GetNetRevenueAnalyticsRequestGroupBy? = nil, requestOptions: RequestOptions? = nil) async throws -> NetRevenueResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/analytics/net-revenue",
            queryParams: [
                "dateFrom": dateFrom.map { .string($0) }, 
                "dateTo": dateTo.map { .string($0) }, 
                "currency": currency.map { .string($0) }, 
                "groupBy": groupBy.map { .string($0.rawValue) }
            ],
            requestOptions: requestOptions,
            responseType: NetRevenueResponse.self
        )
    }

    /// Monthly cohort retention matrix showing what percentage of each cohort is retained over time.
    ///
    /// - Parameter months: Number of months to analyze (default 12)
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getChurnCohorts(months: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> ChurnCohortsResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/analytics/churn-cohorts",
            queryParams: [
                "months": months.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: ChurnCohortsResponse.self
        )
    }

    /// Average customer LTV and lifespan, broken down by plan.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func getLifetimeValue(requestOptions: RequestOptions? = nil) async throws -> LtvResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/analytics/ltv",
            requestOptions: requestOptions,
            responseType: LtvResponse.self
        )
    }
}