<?php

namespace NovaBilling\Coupons\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Coupons\Types\CreateCouponDtoDiscountType;
use NovaBilling\Core\Types\ArrayType;

class CreateCouponDto extends JsonSerializableType
{
    /**
     * @var string $code Unique coupon code
     */
    #[JsonProperty('code')]
    public string $code;

    /**
     * @var string $name Display name
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var value-of<CreateCouponDtoDiscountType> $discountType
     */
    #[JsonProperty('discountType')]
    public string $discountType;

    /**
     * @var float $discountValue Discount value (percentage 0-100 or fixed amount)
     */
    #[JsonProperty('discountValue')]
    public float $discountValue;

    /**
     * @var ?string $currency Currency for FIXED_AMOUNT discounts
     */
    #[JsonProperty('currency')]
    public ?string $currency;

    /**
     * @var ?float $maxRedemptions Max number of redemptions (null = unlimited)
     */
    #[JsonProperty('maxRedemptions')]
    public ?float $maxRedemptions;

    /**
     * @var ?array<string> $appliesToPlanIds Plan IDs this coupon applies to (empty = all)
     */
    #[JsonProperty('appliesToPlanIds'), ArrayType(['string'])]
    public ?array $appliesToPlanIds;

    /**
     * @var ?string $expiresAt
     */
    #[JsonProperty('expiresAt')]
    public ?string $expiresAt;

    /**
     * @var ?string $createdAt Backdate createdAt (ISO 8601). For data imports.
     */
    #[JsonProperty('createdAt')]
    public ?string $createdAt;

    /**
     * @param array{
     *   code: string,
     *   name: string,
     *   discountType: value-of<CreateCouponDtoDiscountType>,
     *   discountValue: float,
     *   description?: ?string,
     *   currency?: ?string,
     *   maxRedemptions?: ?float,
     *   appliesToPlanIds?: ?array<string>,
     *   expiresAt?: ?string,
     *   createdAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->code = $values['code'];
        $this->name = $values['name'];
        $this->description = $values['description'] ?? null;
        $this->discountType = $values['discountType'];
        $this->discountValue = $values['discountValue'];
        $this->currency = $values['currency'] ?? null;
        $this->maxRedemptions = $values['maxRedemptions'] ?? null;
        $this->appliesToPlanIds = $values['appliesToPlanIds'] ?? null;
        $this->expiresAt = $values['expiresAt'] ?? null;
        $this->createdAt = $values['createdAt'] ?? null;
    }
}
