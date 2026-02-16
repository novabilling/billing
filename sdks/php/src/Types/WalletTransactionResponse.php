<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class WalletTransactionResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $walletId
     */
    #[JsonProperty('walletId')]
    public string $walletId;

    /**
     * @var value-of<WalletTransactionResponseTransactionType> $transactionType
     */
    #[JsonProperty('transactionType')]
    public string $transactionType;

    /**
     * @var value-of<WalletTransactionResponseStatus> $status
     */
    #[JsonProperty('status')]
    public string $status;

    /**
     * @var value-of<WalletTransactionResponseTransactionStatus> $transactionStatus
     */
    #[JsonProperty('transactionStatus')]
    public string $transactionStatus;

    /**
     * @var string $creditAmount Credits added or deducted
     */
    #[JsonProperty('creditAmount')]
    public string $creditAmount;

    /**
     * @var string $amount Monetary equivalent
     */
    #[JsonProperty('amount')]
    public string $amount;

    /**
     * @var ?string $invoiceId
     */
    #[JsonProperty('invoiceId')]
    public ?string $invoiceId;

    /**
     * @var ?string $settledAt
     */
    #[JsonProperty('settledAt')]
    public ?string $settledAt;

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
     * @param array{
     *   id: string,
     *   walletId: string,
     *   transactionType: value-of<WalletTransactionResponseTransactionType>,
     *   status: value-of<WalletTransactionResponseStatus>,
     *   transactionStatus: value-of<WalletTransactionResponseTransactionStatus>,
     *   creditAmount: string,
     *   amount: string,
     *   createdAt: string,
     *   invoiceId?: ?string,
     *   settledAt?: ?string,
     *   metadata?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->walletId = $values['walletId'];
        $this->transactionType = $values['transactionType'];
        $this->status = $values['status'];
        $this->transactionStatus = $values['transactionStatus'];
        $this->creditAmount = $values['creditAmount'];
        $this->amount = $values['amount'];
        $this->invoiceId = $values['invoiceId'] ?? null;
        $this->settledAt = $values['settledAt'] ?? null;
        $this->metadata = $values['metadata'] ?? null;
        $this->createdAt = $values['createdAt'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
