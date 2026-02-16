using System.Text.Json;
using NovaBilling.Core;

namespace NovaBilling;

public partial class PaymentsClient : IPaymentsClient
{
    private RawClient _client;

    internal PaymentsClient(RawClient client)
    {
        _client = client;
    }

    private async Task<WithRawResponse<PaginatedPaymentResponse>> ListAsyncCore(
        ListPaymentsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        var _queryString = new NovaBilling.Core.QueryStringBuilder.Builder(capacity: 7)
            .Add("status", request.Status)
            .Add("provider", request.Provider)
            .Add("invoiceId", request.InvoiceId)
            .Add("dateFrom", request.DateFrom)
            .Add("dateTo", request.DateTo)
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
                    Path = "api/payments",
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
                var responseData = JsonUtils.Deserialize<PaginatedPaymentResponse>(responseBody)!;
                return new WithRawResponse<PaginatedPaymentResponse>()
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
                    case 401:
                        throw new UnauthorizedError(JsonUtils.Deserialize<object>(responseBody));
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

    private async Task<WithRawResponse<PaymentResponse>> PaymentsControllerCreateAsyncCore(
        CreatePaymentDto request,
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
                    Path = "api/payments",
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
                var responseData = JsonUtils.Deserialize<PaymentResponse>(responseBody)!;
                return new WithRawResponse<PaymentResponse>()
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

    private async Task<WithRawResponse<PaymentResponse>> GetAsyncCore(
        GetPaymentsRequest request,
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
                        "api/payments/{0}",
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
                var responseData = JsonUtils.Deserialize<PaymentResponse>(responseBody)!;
                return new WithRawResponse<PaymentResponse>()
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

    private async Task<WithRawResponse<PaymentResponse>> RefundAsyncCore(
        RefundPaymentDto request,
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
                    Path = string.Format(
                        "api/payments/{0}/refund",
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
                var responseData = JsonUtils.Deserialize<PaymentResponse>(responseBody)!;
                return new WithRawResponse<PaymentResponse>()
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
                    case 400:
                        throw new BadRequestError(JsonUtils.Deserialize<object>(responseBody));
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

    /// <summary>
    /// Retrieve a paginated list of payments. Supports filtering by status, provider, invoice, and date range.
    /// </summary>
    /// <example><code>
    /// await client.Payments.ListAsync(new ListPaymentsRequest());
    /// </code></example>
    public WithRawResponseTask<PaginatedPaymentResponse> ListAsync(
        ListPaymentsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaginatedPaymentResponse>(
            ListAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Create a payment record manually. Useful for importing historical data. If status is SUCCEEDED, the associated invoice will also be marked as paid.
    /// </summary>
    /// <example><code>
    /// await client.Payments.PaymentsControllerCreateAsync(
    ///     new CreatePaymentDto
    ///     {
    ///         InvoiceId = "invoiceId",
    ///         Provider = "manual",
    ///         Amount = 49.99,
    ///         Currency = "USD",
    ///         Status = CreatePaymentDtoStatus.Processing,
    ///     }
    /// );
    /// </code></example>
    public WithRawResponseTask<PaymentResponse> PaymentsControllerCreateAsync(
        CreatePaymentDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaymentResponse>(
            PaymentsControllerCreateAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Retrieve detailed payment information including the associated invoice and customer.
    /// </summary>
    /// <example><code>
    /// await client.Payments.GetAsync(new GetPaymentsRequest { Id = "id" });
    /// </code></example>
    public WithRawResponseTask<PaymentResponse> GetAsync(
        GetPaymentsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaymentResponse>(
            GetAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Issue a full or partial refund for a succeeded payment. If amount is omitted, the full payment amount is refunded.
    /// </summary>
    /// <example><code>
    /// await client.Payments.RefundAsync(new RefundPaymentDto { Id = "id" });
    /// </code></example>
    public WithRawResponseTask<PaymentResponse> RefundAsync(
        RefundPaymentDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaymentResponse>(
            RefundAsyncCore(request, options, cancellationToken)
        );
    }
}
