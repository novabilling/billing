<?php

namespace NovaBilling\CreditNotes\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\CreditNotes\Types\UpdateCreditNoteDtoReason;
use NovaBilling\Core\Types\ArrayType;

class UpdateCreditNoteDto extends JsonSerializableType
{
    /**
     * @var ?float $amount Updated amount
     */
    #[JsonProperty('amount')]
    public ?float $amount;

    /**
     * @var ?value-of<UpdateCreditNoteDtoReason> $reason
     */
    #[JsonProperty('reason')]
    public ?string $reason;

    /**
     * @var ?array<string, mixed> $metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @param array{
     *   amount?: ?float,
     *   reason?: ?value-of<UpdateCreditNoteDtoReason>,
     *   metadata?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->amount = $values['amount'] ?? null;
        $this->reason = $values['reason'] ?? null;
        $this->metadata = $values['metadata'] ?? null;
    }
}
