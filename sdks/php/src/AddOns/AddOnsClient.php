<?php

namespace NovaBilling\AddOns;

use Psr\Http\Client\ClientInterface;
use NovaBilling\Core\Client\RawClient;
use NovaBilling\AddOns\Requests\ListAddOnsRequest;
use NovaBilling\Types\PaginatedAddOnResponse;
use NovaBilling\Exceptions\NovabillingException;
use NovaBilling\Exceptions\NovabillingApiException;
use NovaBilling\Core\Json\JsonApiRequest;
use NovaBilling\Environments;
use NovaBilling\Core\Client\HttpMethod;
use JsonException;
use Psr\Http\Client\ClientExceptionInterface;
use NovaBilling\AddOns\Requests\CreateAddOnDto;
use NovaBilling\Types\AddOnResponse;
use NovaBilling\AddOns\Requests\UpdateAddOnDto;
use NovaBilling\AddOns\Requests\ApplyAddOnDto;
use NovaBilling\Types\AppliedAddOnResponse;
use NovaBilling\AddOns\Requests\ListAppliedAddOnsRequest;
use NovaBilling\Core\Json\JsonDecoder;

class AddOnsClient
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
     * Retrieve a paginated list of add-ons with prices.
     *
     * @param ListAddOnsRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PaginatedAddOnResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function list(ListAddOnsRequest $request = new ListAddOnsRequest(), ?array $options = null): PaginatedAddOnResponse
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
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
                    path: "api/add-ons",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PaginatedAddOnResponse::fromJson($json);
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
     * Create a one-time charge add-on with multi-currency pricing.
     *
     * @param CreateAddOnDto $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return AddOnResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function create(CreateAddOnDto $request, ?array $options = null): AddOnResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/add-ons",
                    method: HttpMethod::POST,
                    body: $request,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return AddOnResponse::fromJson($json);
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
     * @param string $id Add-on ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return AddOnResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function get(string $id, ?array $options = null): AddOnResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/add-ons/{$id}",
                    method: HttpMethod::GET,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return AddOnResponse::fromJson($json);
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
     * @param string $id Add-on ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return AddOnResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function delete(string $id, ?array $options = null): AddOnResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/add-ons/{$id}",
                    method: HttpMethod::DELETE,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return AddOnResponse::fromJson($json);
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
     * @param string $id Add-on ID
     * @param UpdateAddOnDto $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return AddOnResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function update(string $id, UpdateAddOnDto $request = new UpdateAddOnDto(), ?array $options = null): AddOnResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/add-ons/{$id}",
                    method: HttpMethod::PATCH,
                    body: $request,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return AddOnResponse::fromJson($json);
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
     * Create a one-time charge for a customer. Will be included in the next invoice.
     *
     * @param ApplyAddOnDto $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return AppliedAddOnResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function apply(ApplyAddOnDto $request, ?array $options = null): AppliedAddOnResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/add-ons/apply",
                    method: HttpMethod::POST,
                    body: $request,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return AppliedAddOnResponse::fromJson($json);
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
     * View one-time charges applied to customers.
     *
     * @param ListAppliedAddOnsRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return array<AppliedAddOnResponse>
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function listApplied(ListAppliedAddOnsRequest $request = new ListAppliedAddOnsRequest(), ?array $options = null): array
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
        if ($request->customerId != null) {
            $query['customerId'] = $request->customerId;
        }
        if ($request->invoiced != null) {
            $query['invoiced'] = $request->invoiced;
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
                    path: "api/add-ons/applied/list",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return JsonDecoder::decodeArray($json, [AppliedAddOnResponse::class]); // @phpstan-ignore-line
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
     * Remove a one-time charge that has not yet been invoiced.
     *
     * @param string $id Applied add-on ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return AppliedAddOnResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function removeApplied(string $id, ?array $options = null): AppliedAddOnResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/add-ons/applied/{$id}",
                    method: HttpMethod::DELETE,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return AppliedAddOnResponse::fromJson($json);
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
