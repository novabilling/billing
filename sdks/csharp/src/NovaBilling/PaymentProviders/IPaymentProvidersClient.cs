namespace NovaBilling;

public partial interface IPaymentProvidersClient
{
    /// <summary>
    /// Retrieve all configured payment providers for the tenant. Credentials are never returned.
    /// </summary>
    WithRawResponseTask<IEnumerable<PaymentProviderResponse>> ListAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Set up a payment provider (stripe, paystack, flutterwave, or mpesa) with encrypted credentials. The provider with the lowest priority number is used by default for checkout.
    /// </summary>
    WithRawResponseTask<PaymentProviderResponse> ConfigureAsync(
        CreateProviderDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve a specific payment provider configuration. Credentials are not included.
    /// </summary>
    WithRawResponseTask<PaymentProviderResponse> GetAsync(
        GetPaymentProvidersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Remove a payment provider configuration. This does not affect existing payments.
    /// </summary>
    WithRawResponseTask<PaymentProviderResponse> DeleteAsync(
        DeletePaymentProvidersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Update provider settings such as active status, priority, or credentials.
    /// </summary>
    WithRawResponseTask<PaymentProviderResponse> UpdateAsync(
        UpdateProviderDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Verify that the provider credentials are valid by making a test API call to the provider.
    /// </summary>
    WithRawResponseTask<ProviderTestResponse> TestConnectionAsync(
        TestConnectionPaymentProvidersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
