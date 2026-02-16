namespace NovaBilling;

public partial interface ISubscriptionsClient
{
    /// <summary>
    /// Retrieve a paginated list of subscriptions. Supports filtering by status, customer, and plan.
    /// </summary>
    WithRawResponseTask<PaginatedSubscriptionResponse> ListAsync(
        ListSubscriptionsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Subscribe a customer to a plan. The plan must have a price matching the specified currency. Optionally set a trial period in days.
    /// </summary>
    WithRawResponseTask<SubscriptionResponse> CreateAsync(
        CreateSubscriptionDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve detailed subscription information including customer, plan with prices, and recent invoices.
    /// </summary>
    WithRawResponseTask<SubscriptionResponse> GetAsync(
        GetSubscriptionsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Update the metadata field on a subscription. Other fields cannot be changed directly.
    /// </summary>
    WithRawResponseTask<SubscriptionResponse> UpdateAsync(
        UpdateSubscriptionDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Cancel a subscription either immediately or at the end of the current billing period. When set to "period_end", the subscription remains active until the current period expires.
    /// </summary>
    WithRawResponseTask<SubscriptionResponse> CancelAsync(
        CancelSubscriptionDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Temporarily pause an active subscription. Only active subscriptions can be paused.
    /// </summary>
    WithRawResponseTask<SubscriptionResponse> PauseAsync(
        PauseSubscriptionsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Resume a previously paused subscription back to active status.
    /// </summary>
    WithRawResponseTask<SubscriptionResponse> ResumeAsync(
        ResumeSubscriptionsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Switch a subscription to a different plan. The new plan must have a price for the subscription's currency. A new billing period starts immediately with the new plan.
    /// </summary>
    WithRawResponseTask<SubscriptionResponse> ChangePlanAsync(
        ChangePlanDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
