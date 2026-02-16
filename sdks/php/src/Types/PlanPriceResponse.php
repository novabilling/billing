<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class PlanPriceResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $planId
     */
    #[JsonProperty('planId')]
    public string $planId;

    /**
     * @var string $currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var string $amount Decimal amount as string
     */
    #[JsonProperty('amount')]
    public string $amount;

    /**
     * @var bool $isActive
     */
    #[JsonProperty('isActive')]
    public bool $isActive;

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
     *   planId: string,
     *   currency: string,
     *   amount: string,
     *   isActive: bool,
     *   createdAt: string,
     *   updatedAt: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->planId = $values['planId'];
        $this->currency = $values['currency'];
        $this->amount = $values['amount'];
        $this->isActive = $values['isActive'];
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
