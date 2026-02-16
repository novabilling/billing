namespace NovaBilling;

public partial interface IChargesClient
{
    /// <summary>
    /// Retrieve all charges, optionally filtered by plan ID.
    /// </summary>
    WithRawResponseTask<IEnumerable<ChargeResponse>> ListAsync(
        ListChargesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a usage-based charge linking a plan to a billable metric. Supported models: STANDARD, GRADUATED, VOLUME, PACKAGE, PERCENTAGE.
    /// </summary>
    WithRawResponseTask<ChargeResponse> CreateAsync(
        CreateChargeDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve a charge with its billable metric, graduated ranges, and filters.
    /// </summary>
    WithRawResponseTask<ChargeResponse> GetAsync(
        GetChargesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Remove a charge from a plan.
    /// </summary>
    WithRawResponseTask<ChargeResponse> DeleteAsync(
        DeleteChargesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Update charge configuration including pricing, ranges, and filters.
    /// </summary>
    WithRawResponseTask<ChargeResponse> UpdateAsync(
        UpdateChargeDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve all charges attached to a specific plan.
    /// </summary>
    WithRawResponseTask<IEnumerable<ChargeResponse>> GetByPlanAsync(
        GetByPlanChargesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
