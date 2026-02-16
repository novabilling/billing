namespace NovaBilling;

public partial interface IEventsClient
{
    Task ListAsync(RequestOptions? options = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Send a single usage event. Uses transactionId for idempotency - sending the same transactionId twice will return the existing event.
    /// </summary>
    WithRawResponseTask<UsageEventResponse> CreateAsync(
        CreateEventDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Send up to 100 usage events in a single request. Each event is processed independently - failures do not affect other events.
    /// </summary>
    WithRawResponseTask<BatchEventResponse> CreateBatchAsync(
        BatchEventsDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve a single usage event by its ID.
    /// </summary>
    WithRawResponseTask<UsageEventResponse> GetAsync(
        GetEventsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve usage events for a specific subscription with optional filtering.
    /// </summary>
    WithRawResponseTask<PaginatedUsageEventResponse> GetBySubscriptionAsync(
        GetBySubscriptionEventsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
