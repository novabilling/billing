<?php

namespace NovaBilling\Plans;

use Psr\Http\Client\ClientInterface;
use NovaBilling\Core\Client\RawClient;
use NovaBilling\Plans\Requests\ListPlansRequest;
use NovaBilling\Types\PlanResponse;
use NovaBilling\Exceptions\NovabillingException;
use NovaBilling\Exceptions\NovabillingApiException;
use NovaBilling\Core\Json\JsonApiRequest;
use NovaBilling\Environments;
use NovaBilling\Core\Client\HttpMethod;
use NovaBilling\Core\Json\JsonDecoder;
use JsonException;
use Psr\Http\Client\ClientExceptionInterface;
use NovaBilling\Plans\Requests\CreatePlanDto;
use NovaBilling\Plans\Requests\UpdatePlanDto;
use NovaBilling\Plans\Requests\AddPricePlansRequest;
use NovaBilling\Types\PlanPriceResponse;

class PlansClient
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
     * Retrieve all billing plans with their prices. Optionally filter by active status.
     *
     * @param ListPlansRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return array<PlanResponse>
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function list(ListPlansRequest $request = new ListPlansRequest(), ?array $options = null): array
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
        if ($request->isActive != null) {
            $query['isActive'] = $request->isActive;
        }
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/plans",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return JsonDecoder::decodeArray($json, [PlanResponse::class]); // @phpstan-ignore-line
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
     * Create a billing plan with a unique code. Optionally include prices for different currencies. Plans can have MONTHLY, QUARTERLY, or YEARLY billing intervals.
     *
     * @param CreatePlanDto $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PlanResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function create(CreatePlanDto $request, ?array $options = null): PlanResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/plans",
                    method: HttpMethod::POST,
                    body: $request,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PlanResponse::fromJson($json);
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
     * Retrieve a plan with all its prices and features.
     *
     * @param string $id Plan ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PlanResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function get(string $id, ?array $options = null): PlanResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/plans/{$id}",
                    method: HttpMethod::GET,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PlanResponse::fromJson($json);
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
     * Delete a billing plan. Plans with active subscriptions should be deactivated instead.
     *
     * @param string $id Plan ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PlanResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function delete(string $id, ?array $options = null): PlanResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/plans/{$id}",
                    method: HttpMethod::DELETE,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PlanResponse::fromJson($json);
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
     * Update plan details like name, description, features, or billing interval.
     *
     * @param string $id Plan ID
     * @param UpdatePlanDto $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PlanResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function update(string $id, UpdatePlanDto $request = new UpdatePlanDto(), ?array $options = null): PlanResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/plans/{$id}",
                    method: HttpMethod::PATCH,
                    body: $request,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PlanResponse::fromJson($json);
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
     * Add a price in a specific currency to a plan. Each plan can have one price per currency.
     *
     * @param string $id Plan ID
     * @param AddPricePlansRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PlanPriceResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function addPrice(string $id, AddPricePlansRequest $request, ?array $options = null): PlanPriceResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/plans/{$id}/prices",
                    method: HttpMethod::POST,
                    body: $request->body,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PlanPriceResponse::fromJson($json);
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
     * Remove a price from a plan. Active subscriptions using this price will not be affected.
     *
     * @param string $id Plan ID
     * @param string $priceId Price ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PlanPriceResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function deletePrice(string $id, string $priceId, ?array $options = null): PlanPriceResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/plans/{$id}/prices/{$priceId}",
                    method: HttpMethod::DELETE,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PlanPriceResponse::fromJson($json);
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
     * Change the amount for an existing price on a plan.
     *
     * @param string $id Plan ID
     * @param string $priceId Price ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PlanPriceResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function updatePrice(string $id, string $priceId, ?array $options = null): PlanPriceResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/plans/{$id}/prices/{$priceId}",
                    method: HttpMethod::PATCH,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PlanPriceResponse::fromJson($json);
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
