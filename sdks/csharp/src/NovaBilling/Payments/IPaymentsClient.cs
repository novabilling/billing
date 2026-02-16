namespace NovaBilling;

public partial interface IPaymentsClient
{
    /// <summary>
    /// Retrieve a paginated list of payments. Supports filtering by status, provider, invoice, and date range.
    /// </summary>
    WithRawResponseTask<PaginatedPaymentResponse> ListAsync(
        ListPaymentsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a payment record manually. Useful for importing historical data. If status is SUCCEEDED, the associated invoice will also be marked as paid.
    /// </summary>
    WithRawResponseTask<PaymentResponse> PaymentsControllerCreateAsync(
        CreatePaymentDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve detailed payment information including the associated invoice and customer.
    /// </summary>
    WithRawResponseTask<PaymentResponse> GetAsync(
        GetPaymentsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Issue a full or partial refund for a succeeded payment. If amount is omitted, the full payment amount is refunded.
    /// </summary>
    WithRawResponseTask<PaymentResponse> RefundAsync(
        RefundPaymentDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
