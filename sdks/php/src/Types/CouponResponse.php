<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class CouponResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $code
     */
    #[JsonProperty('code')]
    public string $code;

    /**
     * @var string $name
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var value-of<CouponResponseDiscountType> $discountType
     */
    #[JsonProperty('discountType')]
    public string $discountType;

    /**
     * @var string $discountValue Discount value as decimal string
     */
    #[JsonProperty('discountValue')]
    public string $discountValue;

    /**
     * @var ?string $currency
     */
    #[JsonProperty('currency')]
    public ?string $currency;

    /**
     * @var ?float $maxRedemptions
     */
    #[JsonProperty('maxRedemptions')]
    public ?float $maxRedemptions;

    /**
     * @var float $redemptionCount
     */
    #[JsonProperty('redemptionCount')]
    public float $redemptionCount;

    /**
     * @var array<string> $appliesToPlanIds
     */
    #[JsonProperty('appliesToPlanIds'), ArrayType(['string'])]
    public array $appliesToPlanIds;

    /**
     * @var bool $isActive
     */
    #[JsonProperty('isActive')]
    public bool $isActive;

    /**
     * @var ?string $expiresAt
     */
    #[JsonProperty('expiresAt')]
    public ?string $expiresAt;

    /**
     * @var string $createdAt
     */
    #[JsonProperty('createdAt')]
    public string $createdAt;

    /**
     * @var string $updatedAt
     */
    #[JsonProperty('updatedAt')]
    public string $updatedAt;

    /**
     * @param array{
     *   id: string,
     *   code: string,
     *   name: string,
     *   discountType: value-of<CouponResponseDiscountType>,
     *   discountValue: string,
     *   redemptionCount: float,
     *   appliesToPlanIds: array<string>,
     *   isActive: bool,
     *   createdAt: string,
     *   updatedAt: string,
     *   description?: ?string,
     *   currency?: ?string,
     *   maxRedemptions?: ?float,
     *   expiresAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->code = $values['code'];
        $this->name = $values['name'];
        $this->description = $values['description'] ?? null;
        $this->discountType = $values['discountType'];
        $this->discountValue = $values['discountValue'];
        $this->currency = $values['currency'] ?? null;
        $this->maxRedemptions = $values['maxRedemptions'] ?? null;
        $this->redemptionCount = $values['redemptionCount'];
        $this->appliesToPlanIds = $values['appliesToPlanIds'];
        $this->isActive = $values['isActive'];
        $this->expiresAt = $values['expiresAt'] ?? null;
        $this->createdAt = $values['createdAt'];
        $this->updatedAt = $values['updatedAt'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
