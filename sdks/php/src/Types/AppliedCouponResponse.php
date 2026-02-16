<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class AppliedCouponResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

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
     * @var ?string $amountOff
     */
    #[JsonProperty('amountOff')]
    public ?string $amountOff;

    /**
     * @var ?float $usesRemaining
     */
    #[JsonProperty('usesRemaining')]
    public ?float $usesRemaining;

    /**
     * @var string $createdAt
     */
    #[JsonProperty('createdAt')]
    public string $createdAt;

    /**
     * @param array{
     *   id: string,
     *   couponId: string,
     *   customerId: string,
     *   createdAt: string,
     *   subscriptionId?: ?string,
     *   amountOff?: ?string,
     *   usesRemaining?: ?float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->couponId = $values['couponId'];
        $this->customerId = $values['customerId'];
        $this->subscriptionId = $values['subscriptionId'] ?? null;
        $this->amountOff = $values['amountOff'] ?? null;
        $this->usesRemaining = $values['usesRemaining'] ?? null;
        $this->createdAt = $values['createdAt'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
