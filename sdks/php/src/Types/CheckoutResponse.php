<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class CheckoutResponse extends JsonSerializableType
{
    /**
     * @var string $checkoutUrl
     */
    #[JsonProperty('checkoutUrl')]
    public string $checkoutUrl;

    /**
     * @var string $paymentId
     */
    #[JsonProperty('paymentId')]
    public string $paymentId;

    /**
     * @var string $provider
     */
    #[JsonProperty('provider')]
    public string $provider;

    /**
     * @var string $expiresAt
     */
    #[JsonProperty('expiresAt')]
    public string $expiresAt;

    /**
     * @param array{
     *   checkoutUrl: string,
     *   paymentId: string,
     *   provider: string,
     *   expiresAt: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->checkoutUrl = $values['checkoutUrl'];
        $this->paymentId = $values['paymentId'];
        $this->provider = $values['provider'];
        $this->expiresAt = $values['expiresAt'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
