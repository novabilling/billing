namespace NovaBilling;

public partial interface IApiKeysClient
{
    /// <summary>
    /// Retrieve all API keys for the tenant. Keys are masked for security — only the last 8 characters are shown.
    /// </summary>
    WithRawResponseTask<IEnumerable<ApiKeyResponse>> ListAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Generate a new API key with specified scopes. The full key is returned only once in the response — store it securely.
    /// </summary>
    WithRawResponseTask<ApiKeyResponse> CreateAsync(
        CreateApiKeyBodyDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Permanently revoke an API key. Any requests using this key will immediately fail.
    /// </summary>
    Task DeleteAsync(
        DeleteApiKeysRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
