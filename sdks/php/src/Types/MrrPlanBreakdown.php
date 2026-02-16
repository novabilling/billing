<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class MrrPlanBreakdown extends JsonSerializableType
{
    /**
     * @var string $planId
     */
    #[JsonProperty('planId')]
    public string $planId;

    /**
     * @var string $planName
     */
    #[JsonProperty('planName')]
    public string $planName;

    /**
     * @var float $mrr
     */
    #[JsonProperty('mrr')]
    public float $mrr;

    /**
     * @var float $subscriptionCount
     */
    #[JsonProperty('subscriptionCount')]
    public float $subscriptionCount;

    /**
     * @param array{
     *   planId: string,
     *   planName: string,
     *   mrr: float,
     *   subscriptionCount: float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->planId = $values['planId'];
        $this->planName = $values['planName'];
        $this->mrr = $values['mrr'];
        $this->subscriptionCount = $values['subscriptionCount'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
