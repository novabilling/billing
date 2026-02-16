<?php

namespace NovaBilling\Coupons\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class ApplyCouponDto extends JsonSerializableType
{
    /**
     * @var string $couponId
     */
    #[JsonProperty('couponId')]
    public string $couponId;

    /**
     * @var string $customerId
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var ?string $subscriptionId
     */
    #[JsonProperty('subscriptionId')]
    public ?string $subscriptionId;

    /**
     * @var ?float $usesRemaining Number of billing cycles to apply (null = forever)
     */
    #[JsonProperty('usesRemaining')]
    public ?float $usesRemaining;

    /**
     * @param array{
     *   couponId: string,
     *   customerId: string,
     *   subscriptionId?: ?string,
     *   usesRemaining?: ?float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->couponId = $values['couponId'];
        $this->customerId = $values['customerId'];
        $this->subscriptionId = $values['subscriptionId'] ?? null;
        $this->usesRemaining = $values['usesRemaining'] ?? null;
    }
}
