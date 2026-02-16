<?php

namespace NovaBilling\Invoices\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class SendEmailInvoicesRequest extends JsonSerializableType
{
    /**
     * @var ?string $email Recipient email address. Defaults to the customer email if omitted.
     */
    #[JsonProperty('email')]
    public ?string $email;

    /**
     * @param array{
     *   email?: ?string,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->email = $values['email'] ?? null;
    }
}
