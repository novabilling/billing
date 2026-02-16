namespace NovaBilling;

public partial interface IBillableMetricsClient
{
    /// <summary>
    /// Retrieve all billable metrics with their filters and charge counts.
    /// </summary>
    WithRawResponseTask<IEnumerable<BillableMetricResponse>> ListAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a new billable metric for usage-based billing. Supported aggregation types: COUNT, SUM, MAX, UNIQUE_COUNT, LATEST, WEIGHTED_SUM.
    /// </summary>
    WithRawResponseTask<BillableMetricResponse> CreateAsync(
        CreateBillableMetricDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve a billable metric with its filters and associated charges.
    /// </summary>
    WithRawResponseTask<BillableMetricResponse> GetAsync(
        GetBillableMetricsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Delete a billable metric. Metrics used in charges cannot be deleted.
    /// </summary>
    WithRawResponseTask<BillableMetricResponse> DeleteAsync(
        DeleteBillableMetricsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Update billable metric details. Code and aggregation type cannot be changed.
    /// </summary>
    WithRawResponseTask<BillableMetricResponse> UpdateAsync(
        UpdateBillableMetricDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
