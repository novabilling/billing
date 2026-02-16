namespace NovaBilling;

public partial interface IPortalClient
{
    /// <summary>
    /// Returns subscriptions, recent invoices, payments, and summary stats for a customer. Use this to render a billing dashboard for your end-users.
    /// </summary>
    Task GetBillingAsync(
        GetBillingPortalRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Returns all subscriptions for the customer with plan details.
    /// </summary>
    WithRawResponseTask<IEnumerable<SubscriptionResponse>> GetSubscriptionsAsync(
        GetSubscriptionsPortalRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Returns a paginated list of invoices. Filter by status to show only pending invoices.
    /// </summary>
    WithRawResponseTask<PaginatedInvoiceResponse> GetInvoicesAsync(
        GetInvoicesPortalRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Initiates a payment session with the configured payment provider. Returns a checkout URL to redirect the customer to.
    /// </summary>
    WithRawResponseTask<CheckoutResponse> CreateCheckoutAsync(
        CreateCheckoutPortalRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Returns a paginated list of all payments made by the customer.
    /// </summary>
    WithRawResponseTask<PaginatedPaymentResponse> GetPaymentsAsync(
        GetPaymentsPortalRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
