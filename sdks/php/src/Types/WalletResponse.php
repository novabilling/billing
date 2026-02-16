<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class WalletResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $customerId
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var ?string $name
     */
    #[JsonProperty('name')]
    public ?string $name;

    /**
     * @var string $currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var string $rateAmount 1 credit = rateAmount in currency
     */
    #[JsonProperty('rateAmount')]
    public string $rateAmount;

    /**
     * @var string $creditsBalance Available credits
     */
    #[JsonProperty('creditsBalance')]
    public string $creditsBalance;

    /**
     * @var string $balance Monetary equivalent of credits
     */
    #[JsonProperty('balance')]
    public string $balance;

    /**
     * @var string $consumedCredits Lifetime consumed credits
     */
    #[JsonProperty('consumedCredits')]
    public string $consumedCredits;

    /**
     * @var string $consumedAmount Lifetime consumed amount
     */
    #[JsonProperty('consumedAmount')]
    public string $consumedAmount;

    /**
     * @var value-of<WalletResponseStatus> $status
     */
    #[JsonProperty('status')]
    public string $status;

    /**
     * @var ?string $expirationAt
     */
    #[JsonProperty('expirationAt')]
    public ?string $expirationAt;

    /**
     * @var ?string $terminatedAt
     */
    #[JsonProperty('terminatedAt')]
    public ?string $terminatedAt;

    /**
     * @var ?WalletCustomerResponse $customer
     */
    #[JsonProperty('customer')]
    public ?WalletCustomerResponse $customer;

    /**
     * @var ?array<string, mixed> $metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @var string $createdAt
     */
    #[JsonProperty('createdAt')]
    public string $createdAt;

    /**
     * @var string $updatedAt
     */
    #[JsonProperty('updatedAt')]
    public string $updatedAt;

    /**
     * @param array{
     *   id: string,
     *   customerId: string,
     *   currency: string,
     *   rateAmount: string,
     *   creditsBalance: string,
     *   balance: string,
     *   consumedCredits: string,
     *   consumedAmount: string,
     *   status: value-of<WalletResponseStatus>,
     *   createdAt: string,
     *   updatedAt: string,
     *   name?: ?string,
     *   expirationAt?: ?string,
     *   terminatedAt?: ?string,
     *   customer?: ?WalletCustomerResponse,
     *   metadata?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->customerId = $values['customerId'];
        $this->name = $values['name'] ?? null;
        $this->currency = $values['currency'];
        $this->rateAmount = $values['rateAmount'];
        $this->creditsBalance = $values['creditsBalance'];
        $this->balance = $values['balance'];
        $this->consumedCredits = $values['consumedCredits'];
        $this->consumedAmount = $values['consumedAmount'];
        $this->status = $values['status'];
        $this->expirationAt = $values['expirationAt'] ?? null;
        $this->terminatedAt = $values['terminatedAt'] ?? null;
        $this->customer = $values['customer'] ?? null;
        $this->metadata = $values['metadata'] ?? null;
        $this->createdAt = $values['createdAt'];
        $this->updatedAt = $values['updatedAt'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
