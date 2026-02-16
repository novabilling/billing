<?php

namespace NovaBilling\Invoices\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class CreateCheckoutInvoicesRequest extends JsonSerializableType
{
    /**
     * @var ?string $callbackUrl URL to redirect customer after payment
     */
    #[JsonProperty('callbackUrl')]
    public ?string $callbackUrl;

    /**
     * @param array{
     *   callbackUrl?: ?string,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->callbackUrl = $values['callbackUrl'] ?? null;
    }
}
