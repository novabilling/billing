<?php

namespace NovaBilling\Webhooks\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class WebhooksControllerStripeRequest extends JsonSerializableType
{
    /**
     * @var string $stripeSignature Stripe webhook signature
     */
    public string $stripeSignature;

    /**
     * @param array{
     *   stripeSignature: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->stripeSignature = $values['stripeSignature'];
    }
}
