using System.Text.Json;
using NovaBilling.Core;

namespace NovaBilling;

public partial class AnalyticsClient : IAnalyticsClient
{
    private RawClient _client;

    internal AnalyticsClient(RawClient client)
    {
        _client = client;
    }

    private async Task<WithRawResponse<RevenueAnalyticsResponse>> GetRevenueAsyncCore(
        GetRevenueAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _queryString = new NovaBilling.Core.QueryStringBuilder.Builder(capacity: 4)
            .Add("dateFrom", request.DateFrom)
            .Add("dateTo", request.DateTo)
            .Add("currency", request.Currency)
            .Add("groupBy", request.GroupBy)
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
                    Path = "api/analytics/revenue",
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
                var responseData = JsonUtils.Deserialize<RevenueAnalyticsResponse>(responseBody)!;
                return new WithRawResponse<RevenueAnalyticsResponse>()
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

    private async Task<WithRawResponse<SubscriptionAnalyticsResponse>> GetSubscriptionsAsyncCore(
        GetSubscriptionsAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _queryString = new NovaBilling.Core.QueryStringBuilder.Builder(capacity: 4)
            .Add("dateFrom", request.DateFrom)
            .Add("dateTo", request.DateTo)
            .Add("currency", request.Currency)
            .Add("groupBy", request.GroupBy)
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
                    Path = "api/analytics/subscriptions",
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
                var responseData = JsonUtils.Deserialize<SubscriptionAnalyticsResponse>(
                    responseBody
                )!;
                return new WithRawResponse<SubscriptionAnalyticsResponse>()
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

    private async Task<WithRawResponse<CustomerAnalyticsResponse>> GetCustomersAsyncCore(
        GetCustomersAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _queryString = new NovaBilling.Core.QueryStringBuilder.Builder(capacity: 4)
            .Add("dateFrom", request.DateFrom)
            .Add("dateTo", request.DateTo)
            .Add("currency", request.Currency)
            .Add("groupBy", request.GroupBy)
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
                    Path = "api/analytics/customers",
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
                var responseData = JsonUtils.Deserialize<CustomerAnalyticsResponse>(responseBody)!;
                return new WithRawResponse<CustomerAnalyticsResponse>()
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

    private async Task<WithRawResponse<PaymentAnalyticsResponse>> GetPaymentsAsyncCore(
        GetPaymentsAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _queryString = new NovaBilling.Core.QueryStringBuilder.Builder(capacity: 5)
            .Add("dateFrom", request.DateFrom)
            .Add("dateTo", request.DateTo)
            .Add("currency", request.Currency)
            .Add("groupBy", request.GroupBy)
            .Add("provider", request.Provider)
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
                    Path = "api/analytics/payments",
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
                var responseData = JsonUtils.Deserialize<PaymentAnalyticsResponse>(responseBody)!;
                return new WithRawResponse<PaymentAnalyticsResponse>()
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

    private async Task<WithRawResponse<MrrBreakdownResponse>> GetMrrBreakdownAsyncCore(
        GetMrrBreakdownAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _queryString = new NovaBilling.Core.QueryStringBuilder.Builder(capacity: 4)
            .Add("dateFrom", request.DateFrom)
            .Add("dateTo", request.DateTo)
            .Add("currency", request.Currency)
            .Add("groupBy", request.GroupBy)
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
                    Path = "api/analytics/mrr-breakdown",
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
                var responseData = JsonUtils.Deserialize<MrrBreakdownResponse>(responseBody)!;
                return new WithRawResponse<MrrBreakdownResponse>()
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

    private async Task<WithRawResponse<NetRevenueResponse>> GetNetRevenueAsyncCore(
        GetNetRevenueAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _queryString = new NovaBilling.Core.QueryStringBuilder.Builder(capacity: 4)
            .Add("dateFrom", request.DateFrom)
            .Add("dateTo", request.DateTo)
            .Add("currency", request.Currency)
            .Add("groupBy", request.GroupBy)
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
                    Path = "api/analytics/net-revenue",
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
                var responseData = JsonUtils.Deserialize<NetRevenueResponse>(responseBody)!;
                return new WithRawResponse<NetRevenueResponse>()
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

    private async Task<WithRawResponse<ChurnCohortsResponse>> GetChurnCohortsAsyncCore(
        GetChurnCohortsAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _queryString = new NovaBilling.Core.QueryStringBuilder.Builder(capacity: 1)
            .Add("months", request.Months)
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
                    Path = "api/analytics/churn-cohorts",
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
                var responseData = JsonUtils.Deserialize<ChurnCohortsResponse>(responseBody)!;
                return new WithRawResponse<ChurnCohortsResponse>()
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

    private async Task<WithRawResponse<LtvResponse>> GetLifetimeValueAsyncCore(
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
                    Path = "api/analytics/ltv",
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
                var responseData = JsonUtils.Deserialize<LtvResponse>(responseBody)!;
                return new WithRawResponse<LtvResponse>()
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
    /// Retrieve revenue metrics including total revenue, MRR (monthly recurring revenue), and revenue breakdown by period. Supports filtering by date range and currency.
    /// </summary>
    /// <example><code>
    /// await client.Analytics.GetRevenueAsync(
    ///     new GetRevenueAnalyticsRequest { DateFrom = "2025-01-01", DateTo = "2025-12-31" }
    /// );
    /// </code></example>
    public WithRawResponseTask<RevenueAnalyticsResponse> GetRevenueAsync(
        GetRevenueAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<RevenueAnalyticsResponse>(
            GetRevenueAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Retrieve subscription metrics including active count, churn rate, new subscriptions, and status distribution.
    /// </summary>
    /// <example><code>
    /// await client.Analytics.GetSubscriptionsAsync(
    ///     new GetSubscriptionsAnalyticsRequest { DateFrom = "2025-01-01", DateTo = "2025-12-31" }
    /// );
    /// </code></example>
    public WithRawResponseTask<SubscriptionAnalyticsResponse> GetSubscriptionsAsync(
        GetSubscriptionsAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<SubscriptionAnalyticsResponse>(
            GetSubscriptionsAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Retrieve customer metrics including total count, new customers, and geographic distribution.
    /// </summary>
    /// <example><code>
    /// await client.Analytics.GetCustomersAsync(
    ///     new GetCustomersAnalyticsRequest { DateFrom = "2025-01-01", DateTo = "2025-12-31" }
    /// );
    /// </code></example>
    public WithRawResponseTask<CustomerAnalyticsResponse> GetCustomersAsync(
        GetCustomersAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<CustomerAnalyticsResponse>(
            GetCustomersAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Retrieve payment metrics including success rate, failure rate, total volume, and breakdown by payment provider.
    /// </summary>
    /// <example><code>
    /// await client.Analytics.GetPaymentsAsync(
    ///     new GetPaymentsAnalyticsRequest { DateFrom = "2025-01-01", DateTo = "2025-12-31" }
    /// );
    /// </code></example>
    public WithRawResponseTask<PaymentAnalyticsResponse> GetPaymentsAsync(
        GetPaymentsAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaymentAnalyticsResponse>(
            GetPaymentsAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// MRR breakdown by movement type (new, expansion, contraction, churn) and by plan.
    /// </summary>
    /// <example><code>
    /// await client.Analytics.GetMrrBreakdownAsync(
    ///     new GetMrrBreakdownAnalyticsRequest { DateFrom = "2025-01-01", DateTo = "2025-12-31" }
    /// );
    /// </code></example>
    public WithRawResponseTask<MrrBreakdownResponse> GetMrrBreakdownAsync(
        GetMrrBreakdownAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<MrrBreakdownResponse>(
            GetMrrBreakdownAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Gross revenue minus refunds and credit notes.
    /// </summary>
    /// <example><code>
    /// await client.Analytics.GetNetRevenueAsync(
    ///     new GetNetRevenueAnalyticsRequest { DateFrom = "2025-01-01", DateTo = "2025-12-31" }
    /// );
    /// </code></example>
    public WithRawResponseTask<NetRevenueResponse> GetNetRevenueAsync(
        GetNetRevenueAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<NetRevenueResponse>(
            GetNetRevenueAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Monthly cohort retention matrix showing what percentage of each cohort is retained over time.
    /// </summary>
    /// <example><code>
    /// await client.Analytics.GetChurnCohortsAsync(new GetChurnCohortsAnalyticsRequest());
    /// </code></example>
    public WithRawResponseTask<ChurnCohortsResponse> GetChurnCohortsAsync(
        GetChurnCohortsAnalyticsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<ChurnCohortsResponse>(
            GetChurnCohortsAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Average customer LTV and lifespan, broken down by plan.
    /// </summary>
    /// <example><code>
    /// await client.Analytics.GetLifetimeValueAsync();
    /// </code></example>
    public WithRawResponseTask<LtvResponse> GetLifetimeValueAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<LtvResponse>(
            GetLifetimeValueAsyncCore(options, cancellationToken)
        );
    }
}
