<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class PlanResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $name
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var string $code
     */
    #[JsonProperty('code')]
    public string $code;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var value-of<PlanResponseBillingInterval> $billingInterval
     */
    #[JsonProperty('billingInterval')]
    public string $billingInterval;

    /**
     * @var ?array<string> $features
     */
    #[JsonProperty('features'), ArrayType(['string'])]
    public ?array $features;

    /**
     * @var bool $isActive
     */
    #[JsonProperty('isActive')]
    public bool $isActive;

    /**
     * @var value-of<PlanResponseBillingTiming> $billingTiming
     */
    #[JsonProperty('billingTiming')]
    public string $billingTiming;

    /**
     * @var ?string $minimumCommitment Minimum commitment amount
     */
    #[JsonProperty('minimumCommitment')]
    public ?string $minimumCommitment;

    /**
     * @var array<PlanPriceResponse> $prices
     */
    #[JsonProperty('prices'), ArrayType([PlanPriceResponse::class])]
    public array $prices;

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
     *   name: string,
     *   code: string,
     *   billingInterval: value-of<PlanResponseBillingInterval>,
     *   isActive: bool,
     *   billingTiming: value-of<PlanResponseBillingTiming>,
     *   prices: array<PlanPriceResponse>,
     *   createdAt: string,
     *   updatedAt: string,
     *   description?: ?string,
     *   features?: ?array<string>,
     *   minimumCommitment?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->name = $values['name'];
        $this->code = $values['code'];
        $this->description = $values['description'] ?? null;
        $this->billingInterval = $values['billingInterval'];
        $this->features = $values['features'] ?? null;
        $this->isActive = $values['isActive'];
        $this->billingTiming = $values['billingTiming'];
        $this->minimumCommitment = $values['minimumCommitment'] ?? null;
        $this->prices = $values['prices'];
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
