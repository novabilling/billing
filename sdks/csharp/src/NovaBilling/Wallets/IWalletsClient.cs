namespace NovaBilling;

public partial interface IWalletsClient
{
    /// <summary>
    /// List wallets, optionally filtered by customer or status.
    /// </summary>
    WithRawResponseTask<PaginatedWalletResponse> ListAsync(
        ListWalletsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a prepaid credit wallet for a customer. Optionally seed it with paid or granted credits.
    /// </summary>
    WithRawResponseTask<WalletResponse> CreateAsync(
        CreateWalletDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<WalletResponse> GetAsync(
        GetWalletsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Terminate a wallet. Remaining credits are voided.
    /// </summary>
    WithRawResponseTask<WalletResponse> DeleteAsync(
        DeleteWalletsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Update wallet name, expiration, or metadata.
    /// </summary>
    WithRawResponseTask<WalletResponse> UpdateAsync(
        UpdateWalletDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Add paid/granted credits or void existing credits from a wallet.
    /// </summary>
    WithRawResponseTask<TopUpResponse> CreateTransactionAsync(
        TopUpWalletDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<PaginatedWalletTransactionResponse> GetTransactionsAsync(
        GetTransactionsWalletsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
