namespace NovaBilling;

public partial interface ITaxesClient
{
    WithRawResponseTask<PaginatedTaxResponse> ListAsync(
        ListTaxesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a new tax rate. Set appliedByDefault to automatically apply to all invoices.
    /// </summary>
    WithRawResponseTask<TaxResponse> CreateAsync(
        CreateTaxDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<TaxResponse> GetAsync(
        GetTaxesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    Task DeleteAsync(
        DeleteTaxesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<TaxResponse> UpdateAsync(
        UpdateTaxDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<IEnumerable<TaxResponse>> TaxesControllerGetCustomerTaxesAsync(
        TaxesControllerGetCustomerTaxesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    Task AssignToCustomerAsync(
        AssignToCustomerTaxesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    Task RemoveFromCustomerAsync(
        RemoveFromCustomerTaxesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<IEnumerable<TaxResponse>> TaxesControllerGetPlanTaxesAsync(
        TaxesControllerGetPlanTaxesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    Task AssignToPlanAsync(
        AssignToPlanTaxesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    Task RemoveFromPlanAsync(
        RemoveFromPlanTaxesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    Task AssignToChargeAsync(
        AssignToChargeTaxesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    Task RemoveFromChargeAsync(
        RemoveFromChargeTaxesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
