<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class LtvResponse extends JsonSerializableType
{
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
     * @var array<LtvPlanBreakdown> $byPlan
     */
    #[JsonProperty('byPlan'), ArrayType([LtvPlanBreakdown::class])]
    public array $byPlan;

    /**
     * @param array{
     *   avgLtv: float,
     *   avgLifespanDays: float,
     *   byPlan: array<LtvPlanBreakdown>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->avgLtv = $values['avgLtv'];
        $this->avgLifespanDays = $values['avgLifespanDays'];
        $this->byPlan = $values['byPlan'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
