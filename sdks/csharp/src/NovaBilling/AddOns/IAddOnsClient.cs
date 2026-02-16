namespace NovaBilling;

public partial interface IAddOnsClient
{
    /// <summary>
    /// Retrieve a paginated list of add-ons with prices.
    /// </summary>
    WithRawResponseTask<PaginatedAddOnResponse> ListAsync(
        ListAddOnsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a one-time charge add-on with multi-currency pricing.
    /// </summary>
    WithRawResponseTask<AddOnResponse> CreateAsync(
        CreateAddOnDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<AddOnResponse> GetAsync(
        GetAddOnsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<AddOnResponse> DeleteAsync(
        DeleteAddOnsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<AddOnResponse> UpdateAsync(
        UpdateAddOnDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a one-time charge for a customer. Will be included in the next invoice.
    /// </summary>
    WithRawResponseTask<AppliedAddOnResponse> ApplyAsync(
        ApplyAddOnDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// View one-time charges applied to customers.
    /// </summary>
    WithRawResponseTask<IEnumerable<AppliedAddOnResponse>> ListAppliedAsync(
        ListAppliedAddOnsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Remove a one-time charge that has not yet been invoiced.
    /// </summary>
    WithRawResponseTask<AppliedAddOnResponse> RemoveAppliedAsync(
        RemoveAppliedAddOnsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
