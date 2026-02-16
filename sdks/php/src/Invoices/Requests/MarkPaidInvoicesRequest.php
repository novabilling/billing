<?php

namespace NovaBilling\Invoices\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class MarkPaidInvoicesRequest extends JsonSerializableType
{
    /**
     * @var ?string $paymentMethod Payment method used (cash, bank_transfer, check, manual). Defaults to "manual".
     */
    #[JsonProperty('paymentMethod')]
    public ?string $paymentMethod;

    /**
     * @param array{
     *   paymentMethod?: ?string,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->paymentMethod = $values['paymentMethod'] ?? null;
    }
}
