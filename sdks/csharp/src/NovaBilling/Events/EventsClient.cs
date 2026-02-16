using System.Text.Json;
using NovaBilling.Core;

namespace NovaBilling;

public partial class EventsClient : IEventsClient
{
    private RawClient _client;

    internal EventsClient(RawClient client)
    {
        _client = client;
    }

    private async Task<WithRawResponse<UsageEventResponse>> CreateAsyncCore(
        CreateEventDto request,
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
                    Path = "api/events",
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
                var responseData = JsonUtils.Deserialize<UsageEventResponse>(responseBody)!;
                return new WithRawResponse<UsageEventResponse>()
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

    private async Task<WithRawResponse<BatchEventResponse>> CreateBatchAsyncCore(
        BatchEventsDto request,
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
                    Path = "api/events/batch",
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
                var responseData = JsonUtils.Deserialize<BatchEventResponse>(responseBody)!;
                return new WithRawResponse<BatchEventResponse>()
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

    private async Task<WithRawResponse<UsageEventResponse>> GetAsyncCore(
        GetEventsRequest request,
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
                        "api/events/{0}",
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
                var responseData = JsonUtils.Deserialize<UsageEventResponse>(responseBody)!;
                return new WithRawResponse<UsageEventResponse>()
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

    private async Task<WithRawResponse<PaginatedUsageEventResponse>> GetBySubscriptionAsyncCore(
        GetBySubscriptionEventsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _queryString = new NovaBilling.Core.QueryStringBuilder.Builder(capacity: 5)
            .Add("code", request.Code)
            .Add("from", request.From)
            .Add("to", request.To)
            .Add("page", request.Page)
            .Add("perPage", request.PerPage)
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
                        "api/events/subscription/{0}",
                        ValueConvert.ToPathParameterString(request.SubscriptionId)
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
                var responseData = JsonUtils.Deserialize<PaginatedUsageEventResponse>(
                    responseBody
                )!;
                return new WithRawResponse<PaginatedUsageEventResponse>()
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

    /// <example><code>
    /// await client.Events.ListAsync();
    /// </code></example>
    public async Task ListAsync(
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
                    Path = "api/events",
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
            throw new NovabillingApiApiException(
                $"Error with status code {response.StatusCode}",
                response.StatusCode,
                responseBody
            );
        }
    }

    /// <summary>
    /// Send a single usage event. Uses transactionId for idempotency - sending the same transactionId twice will return the existing event.
    /// </summary>
    /// <example><code>
    /// await client.Events.CreateAsync(
    ///     new CreateEventDto
    ///     {
    ///         TransactionId = "evt_12345",
    ///         SubscriptionId = "sub_abc123",
    ///         Code = "api_calls",
    ///     }
    /// );
    /// </code></example>
    public WithRawResponseTask<UsageEventResponse> CreateAsync(
        CreateEventDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<UsageEventResponse>(
            CreateAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Send up to 100 usage events in a single request. Each event is processed independently - failures do not affect other events.
    /// </summary>
    /// <example><code>
    /// await client.Events.CreateBatchAsync(
    ///     new BatchEventsDto
    ///     {
    ///         Events = new List&lt;CreateEventDto&gt;()
    ///         {
    ///             new CreateEventDto
    ///             {
    ///                 TransactionId = "evt_12345",
    ///                 SubscriptionId = "sub_abc123",
    ///                 Code = "api_calls",
    ///             },
    ///         },
    ///     }
    /// );
    /// </code></example>
    public WithRawResponseTask<BatchEventResponse> CreateBatchAsync(
        BatchEventsDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<BatchEventResponse>(
            CreateBatchAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Retrieve a single usage event by its ID.
    /// </summary>
    /// <example><code>
    /// await client.Events.GetAsync(new GetEventsRequest { Id = "id" });
    /// </code></example>
    public WithRawResponseTask<UsageEventResponse> GetAsync(
        GetEventsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<UsageEventResponse>(
            GetAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Retrieve usage events for a specific subscription with optional filtering.
    /// </summary>
    /// <example><code>
    /// await client.Events.GetBySubscriptionAsync(
    ///     new GetBySubscriptionEventsRequest { SubscriptionId = "subscriptionId" }
    /// );
    /// </code></example>
    public WithRawResponseTask<PaginatedUsageEventResponse> GetBySubscriptionAsync(
        GetBySubscriptionEventsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaginatedUsageEventResponse>(
            GetBySubscriptionAsyncCore(request, options, cancellationToken)
        );
    }
}
