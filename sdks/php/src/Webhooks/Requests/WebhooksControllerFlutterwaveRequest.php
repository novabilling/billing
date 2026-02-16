<?php

namespace NovaBilling\Webhooks\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class WebhooksControllerFlutterwaveRequest extends JsonSerializableType
{
    /**
     * @var ?string $verifHash Flutterwave verification hash
     */
    public ?string $verifHash;

    /**
     * @param array{
     *   verifHash?: ?string,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->verifHash = $values['verifHash'] ?? null;
    }
}
