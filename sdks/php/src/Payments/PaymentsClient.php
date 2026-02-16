<?php

namespace NovaBilling\Payments;

use Psr\Http\Client\ClientInterface;
use NovaBilling\Core\Client\RawClient;
use NovaBilling\Payments\Requests\ListPaymentsRequest;
use NovaBilling\Types\PaginatedPaymentResponse;
use NovaBilling\Exceptions\NovabillingException;
use NovaBilling\Exceptions\NovabillingApiException;
use NovaBilling\Core\Json\JsonApiRequest;
use NovaBilling\Environments;
use NovaBilling\Core\Client\HttpMethod;
use JsonException;
use Psr\Http\Client\ClientExceptionInterface;
use NovaBilling\Payments\Requests\CreatePaymentDto;
use NovaBilling\Types\PaymentResponse;
use NovaBilling\Payments\Requests\RefundPaymentDto;

class PaymentsClient
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
     * Retrieve a paginated list of payments. Supports filtering by status, provider, invoice, and date range.
     *
     * @param ListPaymentsRequest $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PaginatedPaymentResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function list(ListPaymentsRequest $request = new ListPaymentsRequest(), ?array $options = null): PaginatedPaymentResponse
    {
        $options = array_merge($this->options, $options ?? []);
        $query = [];
        if ($request->status != null) {
            $query['status'] = $request->status;
        }
        if ($request->provider != null) {
            $query['provider'] = $request->provider;
        }
        if ($request->invoiceId != null) {
            $query['invoiceId'] = $request->invoiceId;
        }
        if ($request->dateFrom != null) {
            $query['dateFrom'] = $request->dateFrom;
        }
        if ($request->dateTo != null) {
            $query['dateTo'] = $request->dateTo;
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
                    path: "api/payments",
                    method: HttpMethod::GET,
                    query: $query,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PaginatedPaymentResponse::fromJson($json);
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
     * Create a payment record manually. Useful for importing historical data. If status is SUCCEEDED, the associated invoice will also be marked as paid.
     *
     * @param CreatePaymentDto $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PaymentResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function paymentsControllerCreate(CreatePaymentDto $request, ?array $options = null): PaymentResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/payments",
                    method: HttpMethod::POST,
                    body: $request,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PaymentResponse::fromJson($json);
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
     * Retrieve detailed payment information including the associated invoice and customer.
     *
     * @param string $id Payment ID
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PaymentResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function get(string $id, ?array $options = null): PaymentResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/payments/{$id}",
                    method: HttpMethod::GET,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PaymentResponse::fromJson($json);
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
     * Issue a full or partial refund for a succeeded payment. If amount is omitted, the full payment amount is refunded.
     *
     * @param string $id Payment ID
     * @param RefundPaymentDto $request
     * @param ?array{
     *   baseUrl?: string,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     *   queryParameters?: array<string, mixed>,
     *   bodyProperties?: array<string, mixed>,
     * } $options
     * @return PaymentResponse
     * @throws NovabillingException
     * @throws NovabillingApiException
     */
    public function refund(string $id, RefundPaymentDto $request = new RefundPaymentDto(), ?array $options = null): PaymentResponse
    {
        $options = array_merge($this->options, $options ?? []);
        try {
            $response = $this->client->sendRequest(
                new JsonApiRequest(
                    baseUrl: $options['baseUrl'] ?? $this->client->options['baseUrl'] ?? Environments::Default_->value,
                    path: "api/payments/{$id}/refund",
                    method: HttpMethod::POST,
                    body: $request,
                ),
                $options,
            );
            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                $json = $response->getBody()->getContents();
                return PaymentResponse::fromJson($json);
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
