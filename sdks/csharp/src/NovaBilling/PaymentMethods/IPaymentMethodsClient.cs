namespace NovaBilling;

public partial interface IPaymentMethodsClient
{
    Task ListAsync(RequestOptions? options = null, CancellationToken cancellationToken = default);

    WithRawResponseTask<PaymentMethodResponse> CreateAsync(
        CreatePaymentMethodDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<IEnumerable<PaymentMethodResponse>> GetByCustomerAsync(
        GetByCustomerPaymentMethodsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<PaymentMethodResponse> GetAsync(
        GetPaymentMethodsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    Task DeleteAsync(
        DeletePaymentMethodsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<PaymentMethodResponse> SetDefaultAsync(
        SetDefaultPaymentMethodsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
