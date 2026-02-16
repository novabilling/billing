using System.Text.Json;
using NovaBilling.Core;

namespace NovaBilling;

public partial class WalletsClient : IWalletsClient
{
    private RawClient _client;

    internal WalletsClient(RawClient client)
    {
        _client = client;
    }

    private async Task<WithRawResponse<PaginatedWalletResponse>> ListAsyncCore(
        ListWalletsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _queryString = new NovaBilling.Core.QueryStringBuilder.Builder(capacity: 4)
            .Add("customerId", request.CustomerId)
            .Add("status", request.Status)
            .Add("page", request.Page)
            .Add("limit", request.Limit)
            .MergeAdditional(options?.AdditionalQueryParameters)
            .Build();
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
                    Path = "api/wallets",
                    QueryString = _queryString,
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
                var responseData = JsonUtils.Deserialize<PaginatedWalletResponse>(responseBody)!;
                return new WithRawResponse<PaginatedWalletResponse>()
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

    private async Task<WithRawResponse<WalletResponse>> CreateAsyncCore(
        CreateWalletDto request,
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
                    Path = "api/wallets",
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
                var responseData = JsonUtils.Deserialize<WalletResponse>(responseBody)!;
                return new WithRawResponse<WalletResponse>()
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

    private async Task<WithRawResponse<WalletResponse>> GetAsyncCore(
        GetWalletsRequest request,
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
                    Path = string.Format(
                        "api/wallets/{0}",
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
            var responseBody = await response.Raw.Content.ReadAsStringAsync();
            try
            {
                var responseData = JsonUtils.Deserialize<WalletResponse>(responseBody)!;
                return new WithRawResponse<WalletResponse>()
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

    private async Task<WithRawResponse<WalletResponse>> DeleteAsyncCore(
        DeleteWalletsRequest request,
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
                        "api/wallets/{0}",
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
            var responseBody = await response.Raw.Content.ReadAsStringAsync();
            try
            {
                var responseData = JsonUtils.Deserialize<WalletResponse>(responseBody)!;
                return new WithRawResponse<WalletResponse>()
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

    private async Task<WithRawResponse<WalletResponse>> UpdateAsyncCore(
        UpdateWalletDto request,
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
                    Method = HttpMethodExtensions.Patch,
                    Path = string.Format(
                        "api/wallets/{0}",
                        ValueConvert.ToPathParameterString(request.Id)
                    ),
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
                var responseData = JsonUtils.Deserialize<WalletResponse>(responseBody)!;
                return new WithRawResponse<WalletResponse>()
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

    private async Task<WithRawResponse<TopUpResponse>> CreateTransactionAsyncCore(
        TopUpWalletDto request,
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
                    Path = "api/wallets/transactions",
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
                var responseData = JsonUtils.Deserialize<TopUpResponse>(responseBody)!;
                return new WithRawResponse<TopUpResponse>()
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

    private async Task<
        WithRawResponse<PaginatedWalletTransactionResponse>
    > GetTransactionsAsyncCore(
        GetTransactionsWalletsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _queryString = new NovaBilling.Core.QueryStringBuilder.Builder(capacity: 5)
            .Add("status", request.Status)
            .Add("transactionStatus", request.TransactionStatus)
            .Add("transactionType", request.TransactionType)
            .Add("page", request.Page)
            .Add("limit", request.Limit)
            .MergeAdditional(options?.AdditionalQueryParameters)
            .Build();
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
                    Path = string.Format(
                        "api/wallets/{0}/transactions",
                        ValueConvert.ToPathParameterString(request.Id)
                    ),
                    QueryString = _queryString,
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
                var responseData = JsonUtils.Deserialize<PaginatedWalletTransactionResponse>(
                    responseBody
                )!;
                return new WithRawResponse<PaginatedWalletTransactionResponse>()
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
    /// List wallets, optionally filtered by customer or status.
    /// </summary>
    /// <example><code>
    /// await client.Wallets.ListAsync(new ListWalletsRequest());
    /// </code></example>
    public WithRawResponseTask<PaginatedWalletResponse> ListAsync(
        ListWalletsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaginatedWalletResponse>(
            ListAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Create a prepaid credit wallet for a customer. Optionally seed it with paid or granted credits.
    /// </summary>
    /// <example><code>
    /// await client.Wallets.CreateAsync(
    ///     new CreateWalletDto { CustomerId = "cust_abc123", Currency = "USD" }
    /// );
    /// </code></example>
    public WithRawResponseTask<WalletResponse> CreateAsync(
        CreateWalletDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<WalletResponse>(
            CreateAsyncCore(request, options, cancellationToken)
        );
    }

    /// <example><code>
    /// await client.Wallets.GetAsync(new GetWalletsRequest { Id = "id" });
    /// </code></example>
    public WithRawResponseTask<WalletResponse> GetAsync(
        GetWalletsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<WalletResponse>(
            GetAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Terminate a wallet. Remaining credits are voided.
    /// </summary>
    /// <example><code>
    /// await client.Wallets.DeleteAsync(new DeleteWalletsRequest { Id = "id" });
    /// </code></example>
    public WithRawResponseTask<WalletResponse> DeleteAsync(
        DeleteWalletsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<WalletResponse>(
            DeleteAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Update wallet name, expiration, or metadata.
    /// </summary>
    /// <example><code>
    /// await client.Wallets.UpdateAsync(new UpdateWalletDto { Id = "id" });
    /// </code></example>
    public WithRawResponseTask<WalletResponse> UpdateAsync(
        UpdateWalletDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<WalletResponse>(
            UpdateAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Add paid/granted credits or void existing credits from a wallet.
    /// </summary>
    /// <example><code>
    /// await client.Wallets.CreateTransactionAsync(new TopUpWalletDto { WalletId = "wallet_id" });
    /// </code></example>
    public WithRawResponseTask<TopUpResponse> CreateTransactionAsync(
        TopUpWalletDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<TopUpResponse>(
            CreateTransactionAsyncCore(request, options, cancellationToken)
        );
    }

    /// <example><code>
    /// await client.Wallets.GetTransactionsAsync(new GetTransactionsWalletsRequest { Id = "id" });
    /// </code></example>
    public WithRawResponseTask<PaginatedWalletTransactionResponse> GetTransactionsAsync(
        GetTransactionsWalletsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaginatedWalletTransactionResponse>(
            GetTransactionsAsyncCore(request, options, cancellationToken)
        );
    }
}
