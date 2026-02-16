namespace NovaBilling;

public partial interface ICustomersClient
{
    /// <summary>
    /// Retrieve a paginated list of customers. Supports filtering by search term, country, and currency.
    /// </summary>
    WithRawResponseTask<PaginatedCustomerResponse> ListAsync(
        ListCustomersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a customer record. The externalId should be unique and map to your application's user ID.
    /// </summary>
    WithRawResponseTask<CustomerResponse> CreateAsync(
        CreateCustomerDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve detailed information about a specific customer including their billing history summary.
    /// </summary>
    WithRawResponseTask<CustomerResponse> GetAsync(
        GetCustomersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Permanently delete a customer. Fails if the customer has active subscriptions.
    /// </summary>
    Task DeleteAsync(
        DeleteCustomersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Update customer fields. Only provided fields will be changed.
    /// </summary>
    WithRawResponseTask<CustomerResponse> UpdateAsync(
        UpdateCustomerDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve all subscriptions for a specific customer.
    /// </summary>
    WithRawResponseTask<IEnumerable<SubscriptionResponse>> GetSubscriptionsAsync(
        GetSubscriptionsCustomersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve all invoices for a specific customer.
    /// </summary>
    WithRawResponseTask<IEnumerable<InvoiceResponse>> GetInvoicesAsync(
        GetInvoicesCustomersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve all payments made by a specific customer.
    /// </summary>
    WithRawResponseTask<IEnumerable<PaymentResponse>> GetPaymentsAsync(
        GetPaymentsCustomersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve saved payment methods (cards, tokens) for a customer.
    /// </summary>
    Task GetPaymentMethodsAsync(
        GetPaymentMethodsCustomersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    Task AddPaymentMethodAsync(
        AddPaymentMethodCustomersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Remove a saved payment method from a customer.
    /// </summary>
    Task DeletePaymentMethodAsync(
        DeletePaymentMethodCustomersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
