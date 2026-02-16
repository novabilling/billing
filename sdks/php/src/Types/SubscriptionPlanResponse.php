<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class SubscriptionPlanResponse extends JsonSerializableType
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
     * @var value-of<SubscriptionPlanResponseBillingInterval> $billingInterval
     */
    #[JsonProperty('billingInterval')]
    public string $billingInterval;

    /**
     * @param array{
     *   id: string,
     *   name: string,
     *   billingInterval: value-of<SubscriptionPlanResponseBillingInterval>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->name = $values['name'];
        $this->billingInterval = $values['billingInterval'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
