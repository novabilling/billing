using System.Text.Json;
using NovaBilling.Core;

namespace NovaBilling;

public partial class PaymentProvidersClient : IPaymentProvidersClient
{
    private RawClient _client;

    internal PaymentProvidersClient(RawClient client)
    {
        _client = client;
    }

    private async Task<WithRawResponse<IEnumerable<PaymentProviderResponse>>> ListAsyncCore(
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
                    Path = "api/payment-providers",
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
                var responseData = JsonUtils.Deserialize<IEnumerable<PaymentProviderResponse>>(
                    responseBody
                )!;
                return new WithRawResponse<IEnumerable<PaymentProviderResponse>>()
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

    private async Task<WithRawResponse<PaymentProviderResponse>> ConfigureAsyncCore(
        CreateProviderDto request,
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
                    Path = "api/payment-providers",
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
                var responseData = JsonUtils.Deserialize<PaymentProviderResponse>(responseBody)!;
                return new WithRawResponse<PaymentProviderResponse>()
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
                    case 409:
                        throw new ConflictError(JsonUtils.Deserialize<object>(responseBody));
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

    private async Task<WithRawResponse<PaymentProviderResponse>> GetAsyncCore(
        GetPaymentProvidersRequest request,
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
                        "api/payment-providers/{0}",
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
                var responseData = JsonUtils.Deserialize<PaymentProviderResponse>(responseBody)!;
                return new WithRawResponse<PaymentProviderResponse>()
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

    private async Task<WithRawResponse<PaymentProviderResponse>> DeleteAsyncCore(
        DeletePaymentProvidersRequest request,
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
                        "api/payment-providers/{0}",
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
                var responseData = JsonUtils.Deserialize<PaymentProviderResponse>(responseBody)!;
                return new WithRawResponse<PaymentProviderResponse>()
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

    private async Task<WithRawResponse<PaymentProviderResponse>> UpdateAsyncCore(
        UpdateProviderDto request,
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
                        "api/payment-providers/{0}",
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
                var responseData = JsonUtils.Deserialize<PaymentProviderResponse>(responseBody)!;
                return new WithRawResponse<PaymentProviderResponse>()
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

    private async Task<WithRawResponse<ProviderTestResponse>> TestConnectionAsyncCore(
        TestConnectionPaymentProvidersRequest request,
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
                        "api/payment-providers/{0}/test",
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
                var responseData = JsonUtils.Deserialize<ProviderTestResponse>(responseBody)!;
                return new WithRawResponse<ProviderTestResponse>()
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

    /// <summary>
    /// Retrieve all configured payment providers for the tenant. Credentials are never returned.
    /// </summary>
    /// <example><code>
    /// await client.PaymentProviders.ListAsync();
    /// </code></example>
    public WithRawResponseTask<IEnumerable<PaymentProviderResponse>> ListAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<IEnumerable<PaymentProviderResponse>>(
            ListAsyncCore(options, cancellationToken)
        );
    }

    /// <summary>
    /// Set up a payment provider (stripe, paystack, flutterwave, or mpesa) with encrypted credentials. The provider with the lowest priority number is used by default for checkout.
    /// </summary>
    /// <example><code>
    /// await client.PaymentProviders.ConfigureAsync(
    ///     new CreateProviderDto
    ///     {
    ///         ProviderName = "flutterwave",
    ///         Credentials = new Dictionary&lt;string, object?&gt;() { { "key", "value" } },
    ///     }
    /// );
    /// </code></example>
    public WithRawResponseTask<PaymentProviderResponse> ConfigureAsync(
        CreateProviderDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaymentProviderResponse>(
            ConfigureAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Retrieve a specific payment provider configuration. Credentials are not included.
    /// </summary>
    /// <example><code>
    /// await client.PaymentProviders.GetAsync(new GetPaymentProvidersRequest { Id = "id" });
    /// </code></example>
    public WithRawResponseTask<PaymentProviderResponse> GetAsync(
        GetPaymentProvidersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaymentProviderResponse>(
            GetAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Remove a payment provider configuration. This does not affect existing payments.
    /// </summary>
    /// <example><code>
    /// await client.PaymentProviders.DeleteAsync(new DeletePaymentProvidersRequest { Id = "id" });
    /// </code></example>
    public WithRawResponseTask<PaymentProviderResponse> DeleteAsync(
        DeletePaymentProvidersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaymentProviderResponse>(
            DeleteAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Update provider settings such as active status, priority, or credentials.
    /// </summary>
    /// <example><code>
    /// await client.PaymentProviders.UpdateAsync(new UpdateProviderDto { Id = "id" });
    /// </code></example>
    public WithRawResponseTask<PaymentProviderResponse> UpdateAsync(
        UpdateProviderDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<PaymentProviderResponse>(
            UpdateAsyncCore(request, options, cancellationToken)
        );
    }

    /// <summary>
    /// Verify that the provider credentials are valid by making a test API call to the provider.
    /// </summary>
    /// <example><code>
    /// await client.PaymentProviders.TestConnectionAsync(
    ///     new TestConnectionPaymentProvidersRequest { Id = "id" }
    /// );
    /// </code></example>
    public WithRawResponseTask<ProviderTestResponse> TestConnectionAsync(
        TestConnectionPaymentProvidersRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    )
    {
        return new WithRawResponseTask<ProviderTestResponse>(
            TestConnectionAsyncCore(request, options, cancellationToken)
        );
    }
}
