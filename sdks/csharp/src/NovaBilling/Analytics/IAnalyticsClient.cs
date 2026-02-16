namespace NovaBilling;

public partial interface IAnalyticsClient
{
    /// <summary>
    /// Retrieve revenue metrics including total revenue, MRR (monthly recurring revenue), and revenue breakdown by period. Supports filtering by date range and currency.
    /// </summary>
    WithRawResponseTask<RevenueAnalyticsResponse> GetRevenueAsync(
        GetRevenueAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve subscription metrics including active count, churn rate, new subscriptions, and status distribution.
    /// </summary>
    WithRawResponseTask<SubscriptionAnalyticsResponse> GetSubscriptionsAsync(
        GetSubscriptionsAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve customer metrics including total count, new customers, and geographic distribution.
    /// </summary>
    WithRawResponseTask<CustomerAnalyticsResponse> GetCustomersAsync(
        GetCustomersAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve payment metrics including success rate, failure rate, total volume, and breakdown by payment provider.
    /// </summary>
    WithRawResponseTask<PaymentAnalyticsResponse> GetPaymentsAsync(
        GetPaymentsAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// MRR breakdown by movement type (new, expansion, contraction, churn) and by plan.
    /// </summary>
    WithRawResponseTask<MrrBreakdownResponse> GetMrrBreakdownAsync(
        GetMrrBreakdownAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Gross revenue minus refunds and credit notes.
    /// </summary>
    WithRawResponseTask<NetRevenueResponse> GetNetRevenueAsync(
        GetNetRevenueAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Monthly cohort retention matrix showing what percentage of each cohort is retained over time.
    /// </summary>
    WithRawResponseTask<ChurnCohortsResponse> GetChurnCohortsAsync(
        GetChurnCohortsAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Average customer LTV and lifespan, broken down by plan.
    /// </summary>
    WithRawResponseTask<LtvResponse> GetLifetimeValueAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
