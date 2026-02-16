<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class CreditNoteResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $invoiceId
     */
    #[JsonProperty('invoiceId')]
    public string $invoiceId;

    /**
     * @var string $customerId
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var string $amount Decimal amount as string
     */
    #[JsonProperty('amount')]
    public string $amount;

    /**
     * @var string $currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var value-of<CreditNoteResponseReason> $reason
     */
    #[JsonProperty('reason')]
    public string $reason;

    /**
     * @var value-of<CreditNoteResponseStatus> $status
     */
    #[JsonProperty('status')]
    public string $status;

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
     *   invoiceId: string,
     *   customerId: string,
     *   amount: string,
     *   currency: string,
     *   reason: value-of<CreditNoteResponseReason>,
     *   status: value-of<CreditNoteResponseStatus>,
     *   createdAt: string,
     *   updatedAt: string,
     *   metadata?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->invoiceId = $values['invoiceId'];
        $this->customerId = $values['customerId'];
        $this->amount = $values['amount'];
        $this->currency = $values['currency'];
        $this->reason = $values['reason'];
        $this->status = $values['status'];
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
