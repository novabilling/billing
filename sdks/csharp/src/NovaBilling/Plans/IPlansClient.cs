namespace NovaBilling;

public partial interface IPlansClient
{
    /// <summary>
    /// Retrieve all billing plans with their prices. Optionally filter by active status.
    /// </summary>
    WithRawResponseTask<IEnumerable<PlanResponse>> ListAsync(
        ListPlansRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a billing plan with a unique code. Optionally include prices for different currencies. Plans can have MONTHLY, QUARTERLY, or YEARLY billing intervals.
    /// </summary>
    WithRawResponseTask<PlanResponse> CreateAsync(
        CreatePlanDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve a plan with all its prices and features.
    /// </summary>
    WithRawResponseTask<PlanResponse> GetAsync(
        GetPlansRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Delete a billing plan. Plans with active subscriptions should be deactivated instead.
    /// </summary>
    WithRawResponseTask<PlanResponse> DeleteAsync(
        DeletePlansRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Update plan details like name, description, features, or billing interval.
    /// </summary>
    WithRawResponseTask<PlanResponse> UpdateAsync(
        UpdatePlanDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Add a price in a specific currency to a plan. Each plan can have one price per currency.
    /// </summary>
    WithRawResponseTask<PlanPriceResponse> AddPriceAsync(
        AddPricePlansRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Remove a price from a plan. Active subscriptions using this price will not be affected.
    /// </summary>
    WithRawResponseTask<PlanPriceResponse> DeletePriceAsync(
        DeletePricePlansRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Change the amount for an existing price on a plan.
    /// </summary>
    WithRawResponseTask<PlanPriceResponse> UpdatePriceAsync(
        UpdatePricePlansRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
