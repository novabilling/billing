namespace NovaBilling;

public partial interface IPlanOverridesClient
{
    /// <summary>
    /// List all plan overrides, optionally filtered by customerId or planId
    /// </summary>
    WithRawResponseTask<PaginatedPlanOverrideResponse> ListAsync(
        ListPlanOverridesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a customer-specific override for a plan (custom pricing, minimum commitment, or charge properties)
    /// </summary>
    WithRawResponseTask<PlanOverrideResponse> CreateAsync(
        CreatePlanOverrideDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<PlanOverrideResponse> GetAsync(
        GetPlanOverridesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    Task DeleteAsync(
        DeletePlanOverridesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<PlanOverrideResponse> UpdateAsync(
        UpdatePlanOverrideDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
