namespace NovaBilling;

public partial interface ICurrenciesClient
{
    /// <summary>
    /// Retrieve all supported currencies with their symbols and metadata.
    /// </summary>
    WithRawResponseTask<IEnumerable<CurrencyResponse>> ListAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
