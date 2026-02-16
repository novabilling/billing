<?php

namespace NovaBilling\CreditNotes\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\CreditNotes\Types\CreateCreditNoteDtoReason;
use NovaBilling\Core\Types\ArrayType;
use NovaBilling\CreditNotes\Types\CreateCreditNoteDtoStatus;

class CreateCreditNoteDto extends JsonSerializableType
{
    /**
     * @var string $invoiceId Invoice ID to credit against
     */
    #[JsonProperty('invoiceId')]
    public string $invoiceId;

    /**
     * @var string $customerId Customer ID
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var float $amount Credit amount
     */
    #[JsonProperty('amount')]
    public float $amount;

    /**
     * @var string $currency Currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var value-of<CreateCreditNoteDtoReason> $reason
     */
    #[JsonProperty('reason')]
    public string $reason;

    /**
     * @var ?array<string, mixed> $metadata Additional metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @var ?value-of<CreateCreditNoteDtoStatus> $status Override status for imports
     */
    #[JsonProperty('status')]
    public ?string $status;

    /**
     * @var ?string $createdAt Backdate createdAt (ISO 8601). For data imports.
     */
    #[JsonProperty('createdAt')]
    public ?string $createdAt;

    /**
     * @param array{
     *   invoiceId: string,
     *   customerId: string,
     *   amount: float,
     *   currency: string,
     *   reason: value-of<CreateCreditNoteDtoReason>,
     *   metadata?: ?array<string, mixed>,
     *   status?: ?value-of<CreateCreditNoteDtoStatus>,
     *   createdAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->invoiceId = $values['invoiceId'];
        $this->customerId = $values['customerId'];
        $this->amount = $values['amount'];
        $this->currency = $values['currency'];
        $this->reason = $values['reason'];
        $this->metadata = $values['metadata'] ?? null;
        $this->status = $values['status'] ?? null;
        $this->createdAt = $values['createdAt'] ?? null;
    }
}
