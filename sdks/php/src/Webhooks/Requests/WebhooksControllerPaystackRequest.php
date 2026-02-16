<?php

namespace NovaBilling\Webhooks\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class WebhooksControllerPaystackRequest extends JsonSerializableType
{
    /**
     * @var string $paystackSignature Paystack HMAC-SHA512 signature
     */
    public string $paystackSignature;

    /**
     * @param array{
     *   paystackSignature: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->paystackSignature = $values['paystackSignature'];
    }
}
