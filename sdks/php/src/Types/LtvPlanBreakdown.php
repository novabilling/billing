<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class LtvPlanBreakdown extends JsonSerializableType
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
     * @var float $avgLtv
     */
    #[JsonProperty('avgLtv')]
    public float $avgLtv;

    /**
     * @var float $avgLifespanDays
     */
    #[JsonProperty('avgLifespanDays')]
    public float $avgLifespanDays;

    /**
     * @param array{
     *   planId: string,
     *   planName: string,
     *   avgLtv: float,
     *   avgLifespanDays: float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->planId = $values['planId'];
        $this->planName = $values['planName'];
        $this->avgLtv = $values['avgLtv'];
        $this->avgLifespanDays = $values['avgLifespanDays'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
