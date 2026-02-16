using System.Text.Json;
using NovaBilling.Core;

namespace NovaBilling;

public partial class ApiKeysClient : IApiKeysClient
{
    private RawClient _client;

    internal ApiKeysClient(RawClient client)
    {
        _client = client;
    }

    private async Task<WithRawResponse<IEnumerable<ApiKeyResponse>>> ListAsyncCore(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _headers = await new NovaBilling.Core.HeadersBuilder.Builder()
            .Add(_client.Options.Headers)
            .Add(_client.Options.AdditionalHeaders)
            .Add(options?.AdditionalHeaders)
            .BuildAsync()
            .ConfigureAwait(false);
        var response = await _client
            .SendRequestAsync(
                new JsonRequest
                {
                    BaseUrl = _client.Options.BaseUrl,
                    Method = HttpMethod.Get,
                    Path = "api/tenants/me/api-keys",
                    Headers = _headers,
                    Options = options,
                },
                cancellationToken
            )
            .ConfigureAwait(false);
        if (response.StatusCode is >= 200 and < 400)
        {
            var responseBody = await response.Raw.Content.ReadAsStringAsync();
            try
            {
                var responseData = JsonUtils.Deserialize<IEnumerable<ApiKeyResponse>>(
                    responseBody
                )!;
                return new WithRawResponse<IEnumerable<ApiKeyResponse>>()
                {
                    Data = responseData,
                    RawResponse = new RawResponse()
                    {
                        StatusCode = response.Raw.StatusCode,
                        Url = response.Raw.RequestMessage?.RequestUri ?? new Uri("about:blank"),
                        Headers = ResponseHeaders.FromHttpResponseMessage(response.Raw),
                    },
                };
            }
            catch (JsonException e)
            {
                throw new NovabillingApiApiException(
                    "Failed to deserialize response",
                    response.StatusCode,
                    responseBody,
                    e
                );
            }
        }
        {
            var responseBody = await response.Raw.Content.ReadAsStringAsync();
            throw new NovabillingApiApiException(
                $"Error with status code {response.StatusCode}",
                response.StatusCode,
                responseBody
            );
        }
    }

    private async Task<WithRawResponse<ApiKeyResponse>> CreateAsyncCore(
        CreateApiKeyBodyDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _headers = await new NovaBilling.Core.HeadersBuilder.Builder()
            .Add(_client.Options.Headers)
            .Add(_client.Options.AdditionalHeaders)
            .Add(options?.AdditionalHeaders)
            .BuildAsync()
            .ConfigureAwait(false);
        var response = await _client
            .SendRequestAsync(
                new JsonRequest
                {
                    BaseUrl = _client.Options.BaseUrl,
                    Method = HttpMethod.Post,
                    Path = "api/tenants/me/api-keys",
                    Body = request,
                    Headers = _headers,
                    ContentType = "application/json",
                    Options = options,
                },
                cancellationToken
            )
            .ConfigureAwait(false);
        if (response.StatusCode is >= 200 and < 400)
        {
            var responseBody = await response.Raw.Content.ReadAsStringAsync();
            try
            {
                var responseData = JsonUtils.Deserialize<ApiKeyResponse>(responseBody)!;
                return new WithRawResponse<ApiKeyResponse>()
                {
                    Data = responseData,
                    RawResponse = new RawResponse()
                    {
                        StatusCode = response.Raw.StatusCode,
                        Url = response.Raw.RequestMessage?.RequestUri ?? new Uri("about:blank"),
                        Headers = ResponseHeaders.FromHttpResponseMessage(response.Raw),
                    },
                };
            }
            catch (JsonException e)
            {
                throw new NovabillingApiApiException(
                    "Failed to deserialize response",
                    response.StatusCode,
                    responseBody,
                    e
                );
            }
        }
        {
            var responseBody = await response.Raw.Content.ReadAsStringAsync();
            throw new NovabillingApiApiException(
                $"Error with status code {response.StatusCode}",
                response.StatusCode,
                responseBody
            );
        }
    }

    /// <summary>
    /// Retrieve all API keys for the tenant. Keys are masked for security — only the last 8 characters are shown.
    /// </summary>
    /// <example><code>
    /// await client.ApiKeys.ListAsync();
    /// </code></example>
    public WithRawResponseTask<IEnumerable<ApiKeyResponse>> ListAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<IEnumerable<ApiKeyResponse>>(
            ListAsyncCore(options, cancellationToken)
        );
    }

    /// <summary>
    /// Generate a new API key with specified scopes. The full key is returned only once in the response — store it securely.
    /// </summary>
    /// <example><code>
    /// await client.ApiKeys.CreateAsync(
    ///     new CreateApiKeyBodyDto
    ///     {
    ///         Name = "Production API Key",
    ///         Scopes = new List&lt;string&gt;() { "read", "write" },
    ///     }
    /// );
    /// </code></example>
    public WithRawResponseTask<ApiKeyResponse> CreateAsync(
        CreateApiKeyBodyDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<ApiKeyResponse>(
            CreateAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Permanently revoke an API key. Any requests using this key will immediately fail.
    /// </summary>
    /// <example><code>
    /// await client.ApiKeys.DeleteAsync(new DeleteApiKeysRequest { Id = "id" });
    /// </code></example>
    public async Task DeleteAsync(
        DeleteApiKeysRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _headers = await new NovaBilling.Core.HeadersBuilder.Builder()
            .Add(_client.Options.Headers)
            .Add(_client.Options.AdditionalHeaders)
            .Add(options?.AdditionalHeaders)
            .BuildAsync()
            .ConfigureAwait(false);
        var response = await _client
            .SendRequestAsync(
                new JsonRequest
                {
                    BaseUrl = _client.Options.BaseUrl,
                    Method = HttpMethod.Delete,
                    Path = string.Format(
                        "api/tenants/me/api-keys/{0}",
                        ValueConvert.ToPathParameterString(request.Id)
                    ),
                    Headers = _headers,
                    Options = options,
                },
                cancellationToken
            )
            .ConfigureAwait(false);
        if (response.StatusCode is >= 200 and < 400)
        {
            return;
        }
        {
            var responseBody = await response.Raw.Content.ReadAsStringAsync();
            try
            {
                switch (response.StatusCode)
                {
                    case 404:
                        throw new NotFoundError(JsonUtils.Deserialize<object>(responseBody));
                }
            }
            catch (JsonException)
            {
                // unable to map error response, throwing generic error
            }
            throw new NovabillingApiApiException(
                $"Error with status code {response.StatusCode}",
                response.StatusCode,
                responseBody
            );
        }
    }
}
