<?php

namespace NovaBilling\Taxes;

use Psr\Http\Client\ClientInterface;
use NovaBilling\Core\Client\RawClient;
use NovaBilling\Taxes\Requests\ListTaxesRequest;
use NovaBilling\Types\PaginatedTaxResponse;
use NovaBilling\Exceptions\NovabillingException;
use NovaBilling\Exceptions\NovabillingApiException;
use NovaBilling\Core\Json\JsonApiRequest;
use NovaBilling\Environments;
use NovaBilling\Core\Client\HttpMethod;
use JsonException;
use Psr\Http\Client\ClientExceptionInterface;
use NovaBilling\Taxes\Requests\CreateTaxDto;
use NovaBilling\Types\TaxResponse;
use NovaBilling\Taxes\Requests\UpdateTaxDto;
use NovaBilling\Core\Json\JsonDecoder;
use NovaBilling\Taxes\Requests\AssignToCustomerTaxesRequest;
use NovaBilling\Taxes\Requests\AssignToPlanTaxesRequest;
use NovaBilling\Taxes\Requests\AssignToChargeTaxesRequest;

class TaxesClient
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
     * @param ListTaxesRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PaginatedTaxResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function list(ListTaxesRequest $request = new ListTaxesRequest(), ?array $options = null): PaginatedTaxResponse
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
        if ($request->appliedByDefault != null) {
            $query['appliedByDefault'] = $request->appliedByDefault;
        }
        if ($request->page != null) {
            $query['page'] = $request->page;
        }
        if ($request->limit != null) {
            $query['limit'] = $request->limit;
        }
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PaginatedTaxResponse::fromJson($json);
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
     * Create a new tax rate. Set appliedByDefault to automatically apply to all invoices.
     *
     * @param CreateTaxDto $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return TaxResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function create(CreateTaxDto $request, ?array $options = null): TaxResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes",
                    method: HttpMethod::POST,
                    body: $request,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return TaxResponse::fromJson($json);
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
     * @param string $id Tax ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return TaxResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function get(string $id, ?array $options = null): TaxResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes/{$id}",
                    method: HttpMethod::GET,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return TaxResponse::fromJson($json);
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
     * @param string $id Tax ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function delete(string $id, ?array $options = null): void
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes/{$id}",
                    method: HttpMethod::DELETE,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                return;
            }
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
     * @param string $id Tax ID
     * @param UpdateTaxDto $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return TaxResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function update(string $id, UpdateTaxDto $request = new UpdateTaxDto(), ?array $options = null): TaxResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes/{$id}",
                    method: HttpMethod::PATCH,
                    body: $request,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return TaxResponse::fromJson($json);
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
     * @param string $customerId Customer ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return array<TaxResponse>
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function taxesControllerGetCustomerTaxes(string $customerId, ?array $options = null): array
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes/customer/{$customerId}",
                    method: HttpMethod::GET,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return JsonDecoder::decodeArray($json, [TaxResponse::class]); // @phpstan-ignore-line
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
     * @param string $customerId Customer ID
     * @param AssignToCustomerTaxesRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function assignToCustomer(string $customerId, AssignToCustomerTaxesRequest $request, ?array $options = null): void
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes/customer/{$customerId}",
                    method: HttpMethod::POST,
                    body: $request->body,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                return;
            }
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
     * @param string $customerId Customer ID
     * @param string $taxId Tax ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function removeFromCustomer(string $customerId, string $taxId, ?array $options = null): void
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes/customer/{$customerId}/{$taxId}",
                    method: HttpMethod::DELETE,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                return;
            }
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
     * @param string $planId Plan ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return array<TaxResponse>
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function taxesControllerGetPlanTaxes(string $planId, ?array $options = null): array
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes/plan/{$planId}",
                    method: HttpMethod::GET,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return JsonDecoder::decodeArray($json, [TaxResponse::class]); // @phpstan-ignore-line
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
     * @param string $planId Plan ID
     * @param AssignToPlanTaxesRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function assignToPlan(string $planId, AssignToPlanTaxesRequest $request, ?array $options = null): void
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes/plan/{$planId}",
                    method: HttpMethod::POST,
                    body: $request->body,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                return;
            }
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
     * @param string $planId Plan ID
     * @param string $taxId Tax ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function removeFromPlan(string $planId, string $taxId, ?array $options = null): void
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes/plan/{$planId}/{$taxId}",
                    method: HttpMethod::DELETE,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                return;
            }
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
     * @param string $chargeId Charge ID
     * @param AssignToChargeTaxesRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function assignToCharge(string $chargeId, AssignToChargeTaxesRequest $request, ?array $options = null): void
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes/charge/{$chargeId}",
                    method: HttpMethod::POST,
                    body: $request->body,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                return;
            }
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
     * @param string $chargeId Charge ID
     * @param string $taxId Tax ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function removeFromCharge(string $chargeId, string $taxId, ?array $options = null): void
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/taxes/charge/{$chargeId}/{$taxId}",
                    method: HttpMethod::DELETE,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                return;
            }
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
