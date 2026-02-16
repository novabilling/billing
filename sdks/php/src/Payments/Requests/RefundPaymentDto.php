<?php

namespace NovaBilling\Payments\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class RefundPaymentDto extends JsonSerializableType
{
    /**
     * @var ?float $amount Amount to refund (full refund if omitted)
     */
    #[JsonProperty('amount')]
    public ?float $amount;

    /**
     * @var ?string $reason Reason for refund
     */
    #[JsonProperty('reason')]
    public ?string $reason;

    /**
     * @param array{
     *   amount?: ?float,
     *   reason?: ?string,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->amount = $values['amount'] ?? null;
        $this->reason = $values['reason'] ?? null;
    }
}
