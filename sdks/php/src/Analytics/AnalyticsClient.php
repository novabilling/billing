<?php

namespace NovaBilling\Analytics;

use Psr\Http\Client\ClientInterface;
use NovaBilling\Core\Client\RawClient;
use NovaBilling\Analytics\Requests\GetRevenueAnalyticsRequest;
use NovaBilling\Types\RevenueAnalyticsResponse;
use NovaBilling\Exceptions\NovabillingException;
use NovaBilling\Exceptions\NovabillingApiException;
use NovaBilling\Core\Json\JsonApiRequest;
use NovaBilling\Environments;
use NovaBilling\Core\Client\HttpMethod;
use JsonException;
use Psr\Http\Client\ClientExceptionInterface;
use NovaBilling\Analytics\Requests\GetSubscriptionsAnalyticsRequest;
use NovaBilling\Types\SubscriptionAnalyticsResponse;
use NovaBilling\Analytics\Requests\GetCustomersAnalyticsRequest;
use NovaBilling\Types\CustomerAnalyticsResponse;
use NovaBilling\Analytics\Requests\GetPaymentsAnalyticsRequest;
use NovaBilling\Types\PaymentAnalyticsResponse;
use NovaBilling\Analytics\Requests\GetMrrBreakdownAnalyticsRequest;
use NovaBilling\Types\MrrBreakdownResponse;
use NovaBilling\Analytics\Requests\GetNetRevenueAnalyticsRequest;
use NovaBilling\Types\NetRevenueResponse;
use NovaBilling\Analytics\Requests\GetChurnCohortsAnalyticsRequest;
use NovaBilling\Types\ChurnCohortsResponse;
use NovaBilling\Types\LtvResponse;

class AnalyticsClient
{
    /**
     * @var array{
     *   baseUrl?: string,
     *   client?: ClientInterface,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     * } $options @phpstan-ignore-next-line Property is used in endpoint methods via HttpEndpointGenerator
     */
    private array $options;

    /**
     * @var RawClient $client
     */
    private RawClient $client;

    /**
     * @param RawClient $client
     * @param ?array{
     *   baseUrl?: string,
     *   client?: ClientInterface,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     * } $options
     */
    public function __construct(
        RawClient $client,
        ?array $options = null,
    ) {
        $this->client = $client;
        $this->options = $options ?? [];
    }

    /**
     * Retrieve revenue metrics including total revenue, MRR (monthly recurring revenue), and revenue breakdown by period. Supports filtering by date range and currency.
     *
     * @param GetRevenueAnalyticsRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return RevenueAnalyticsResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function getRevenue(GetRevenueAnalyticsRequest $request = new GetRevenueAnalyticsRequest(), ?array $options = null): RevenueAnalyticsResponse
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
        if ($request->dateFrom != null) {
            $query['dateFrom'] = $request->dateFrom;
        }
        if ($request->dateTo != null) {
            $query['dateTo'] = $request->dateTo;
        }
        if ($request->currency != null) {
            $query['currency'] = $request->currency;
        }
        if ($request->groupBy != null) {
            $query['groupBy'] = $request->groupBy;
        }
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/analytics/revenue",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return RevenueAnalyticsResponse::fromJson($json);
            }
        } catch (JsonException $e) {
            throw new NovabillingException(message: "Failed to deserialize response: {$e->getMessage()}", previous: $e);
        } catch (ClientExceptionInterface $e) {
            throw new NovabillingException(message: $e->getMessage(), previous: $e);
        }
        throw new NovabillingApiException(
            message: 'API request failed',
            statusCode: $statusCode,
            body: $response->getBody()->getContents(),
        );
    }

    /**
     * Retrieve subscription metrics including active count, churn rate, new subscriptions, and status distribution.
     *
     * @param GetSubscriptionsAnalyticsRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return SubscriptionAnalyticsResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function getSubscriptions(GetSubscriptionsAnalyticsRequest $request = new GetSubscriptionsAnalyticsRequest(), ?array $options = null): SubscriptionAnalyticsResponse
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
        if ($request->dateFrom != null) {
            $query['dateFrom'] = $request->dateFrom;
        }
        if ($request->dateTo != null) {
            $query['dateTo'] = $request->dateTo;
        }
        if ($request->currency != null) {
            $query['currency'] = $request->currency;
        }
        if ($request->groupBy != null) {
            $query['groupBy'] = $request->groupBy;
        }
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/analytics/subscriptions",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return SubscriptionAnalyticsResponse::fromJson($json);
            }
        } catch (JsonException $e) {
            throw new NovabillingException(message: "Failed to deserialize response: {$e->getMessage()}", previous: $e);
        } catch (ClientExceptionInterface $e) {
            throw new NovabillingException(message: $e->getMessage(), previous: $e);
        }
        throw new NovabillingApiException(
            message: 'API request failed',
            statusCode: $statusCode,
            body: $response->getBody()->getContents(),
        );
    }

    /**
     * Retrieve customer metrics including total count, new customers, and geographic distribution.
     *
     * @param GetCustomersAnalyticsRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return CustomerAnalyticsResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function getCustomers(GetCustomersAnalyticsRequest $request = new GetCustomersAnalyticsRequest(), ?array $options = null): CustomerAnalyticsResponse
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
        if ($request->dateFrom != null) {
            $query['dateFrom'] = $request->dateFrom;
        }
        if ($request->dateTo != null) {
            $query['dateTo'] = $request->dateTo;
        }
        if ($request->currency != null) {
            $query['currency'] = $request->currency;
        }
        if ($request->groupBy != null) {
            $query['groupBy'] = $request->groupBy;
        }
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/analytics/customers",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return CustomerAnalyticsResponse::fromJson($json);
            }
        } catch (JsonException $e) {
            throw new NovabillingException(message: "Failed to deserialize response: {$e->getMessage()}", previous: $e);
        } catch (ClientExceptionInterface $e) {
            throw new NovabillingException(message: $e->getMessage(), previous: $e);
        }
        throw new NovabillingApiException(
            message: 'API request failed',
            statusCode: $statusCode,
            body: $response->getBody()->getContents(),
        );
    }

    /**
     * Retrieve payment metrics including success rate, failure rate, total volume, and breakdown by payment provider.
     *
     * @param GetPaymentsAnalyticsRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PaymentAnalyticsResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function getPayments(GetPaymentsAnalyticsRequest $request = new GetPaymentsAnalyticsRequest(), ?array $options = null): PaymentAnalyticsResponse
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
        if ($request->dateFrom != null) {
            $query['dateFrom'] = $request->dateFrom;
        }
        if ($request->dateTo != null) {
            $query['dateTo'] = $request->dateTo;
        }
        if ($request->currency != null) {
            $query['currency'] = $request->currency;
        }
        if ($request->groupBy != null) {
            $query['groupBy'] = $request->groupBy;
        }
        if ($request->provider != null) {
            $query['provider'] = $request->provider;
        }
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/analytics/payments",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PaymentAnalyticsResponse::fromJson($json);
            }
        } catch (JsonException $e) {
            throw new NovabillingException(message: "Failed to deserialize response: {$e->getMessage()}", previous: $e);
        } catch (ClientExceptionInterface $e) {
            throw new NovabillingException(message: $e->getMessage(), previous: $e);
        }
        throw new NovabillingApiException(
            message: 'API request failed',
            statusCode: $statusCode,
            body: $response->getBody()->getContents(),
        );
    }

    /**
     * MRR breakdown by movement type (new, expansion, contraction, churn) and by plan.
     *
     * @param GetMrrBreakdownAnalyticsRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return MrrBreakdownResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function getMrrBreakdown(GetMrrBreakdownAnalyticsRequest $request = new GetMrrBreakdownAnalyticsRequest(), ?array $options = null): MrrBreakdownResponse
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
        if ($request->dateFrom != null) {
            $query['dateFrom'] = $request->dateFrom;
        }
        if ($request->dateTo != null) {
            $query['dateTo'] = $request->dateTo;
        }
        if ($request->currency != null) {
            $query['currency'] = $request->currency;
        }
        if ($request->groupBy != null) {
            $query['groupBy'] = $request->groupBy;
        }
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/analytics/mrr-breakdown",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return MrrBreakdownResponse::fromJson($json);
            }
        } catch (JsonException $e) {
            throw new NovabillingException(message: "Failed to deserialize response: {$e->getMessage()}", previous: $e);
        } catch (ClientExceptionInterface $e) {
            throw new NovabillingException(message: $e->getMessage(), previous: $e);
        }
        throw new NovabillingApiException(
            message: 'API request failed',
            statusCode: $statusCode,
            body: $response->getBody()->getContents(),
        );
    }

    /**
     * Gross revenue minus refunds and credit notes.
     *
     * @param GetNetRevenueAnalyticsRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return NetRevenueResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function getNetRevenue(GetNetRevenueAnalyticsRequest $request = new GetNetRevenueAnalyticsRequest(), ?array $options = null): NetRevenueResponse
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
        if ($request->dateFrom != null) {
            $query['dateFrom'] = $request->dateFrom;
        }
        if ($request->dateTo != null) {
            $query['dateTo'] = $request->dateTo;
        }
        if ($request->currency != null) {
            $query['currency'] = $request->currency;
        }
        if ($request->groupBy != null) {
            $query['groupBy'] = $request->groupBy;
        }
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/analytics/net-revenue",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return NetRevenueResponse::fromJson($json);
            }
        } catch (JsonException $e) {
            throw new NovabillingException(message: "Failed to deserialize response: {$e->getMessage()}", previous: $e);
        } catch (ClientExceptionInterface $e) {
            throw new NovabillingException(message: $e->getMessage(), previous: $e);
        }
        throw new NovabillingApiException(
            message: 'API request failed',
            statusCode: $statusCode,
            body: $response->getBody()->getContents(),
        );
    }

    /**
     * Monthly cohort retention matrix showing what percentage of each cohort is retained over time.
     *
     * @param GetChurnCohortsAnalyticsRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return ChurnCohortsResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function getChurnCohorts(GetChurnCohortsAnalyticsRequest $request = new GetChurnCohortsAnalyticsRequest(), ?array $options = null): ChurnCohortsResponse
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
        if ($request->months != null) {
            $query['months'] = $request->months;
        }
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/analytics/churn-cohorts",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return ChurnCohortsResponse::fromJson($json);
            }
        } catch (JsonException $e) {
            throw new NovabillingException(message: "Failed to deserialize response: {$e->getMessage()}", previous: $e);
        } catch (ClientExceptionInterface $e) {
            throw new NovabillingException(message: $e->getMessage(), previous: $e);
        }
        throw new NovabillingApiException(
            message: 'API request failed',
            statusCode: $statusCode,
            body: $response->getBody()->getContents(),
        );
    }

    /**
     * Average customer LTV and lifespan, broken down by plan.
     *
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return LtvResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function getLifetimeValue(?array $options = null): LtvResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/analytics/ltv",
                    method: HttpMethod::GET,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return LtvResponse::fromJson($json);
            }
        } catch (JsonException $e) {
            throw new NovabillingException(message: "Failed to deserialize response: {$e->getMessage()}", previous: $e);
        } catch (ClientExceptionInterface $e) {
            throw new NovabillingException(message: $e->getMessage(), previous: $e);
        }
        throw new NovabillingApiException(
            message: 'API request failed',
            statusCode: $statusCode,
            body: $response->getBody()->getContents(),
        );
    }
}
