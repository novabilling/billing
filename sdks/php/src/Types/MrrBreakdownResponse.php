<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class MrrBreakdownResponse extends JsonSerializableType
{
    /**
     * @var float $totalMrr
     */
    #[JsonProperty('totalMrr')]
    public float $totalMrr;

    /**
     * @var float $newMrr
     */
    #[JsonProperty('newMrr')]
    public float $newMrr;

    /**
     * @var float $expansionMrr
     */
    #[JsonProperty('expansionMrr')]
    public float $expansionMrr;

    /**
     * @var float $contractionMrr
     */
    #[JsonProperty('contractionMrr')]
    public float $contractionMrr;

    /**
     * @var float $churnMrr
     */
    #[JsonProperty('churnMrr')]
    public float $churnMrr;

    /**
     * @var float $netNewMrr
     */
    #[JsonProperty('netNewMrr')]
    public float $netNewMrr;

    /**
     * @var array<MrrPlanBreakdown> $byPlan
     */
    #[JsonProperty('byPlan'), ArrayType([MrrPlanBreakdown::class])]
    public array $byPlan;

    /**
     * @param array{
     *   totalMrr: float,
     *   newMrr: float,
     *   expansionMrr: float,
     *   contractionMrr: float,
     *   churnMrr: float,
     *   netNewMrr: float,
     *   byPlan: array<MrrPlanBreakdown>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->totalMrr = $values['totalMrr'];
        $this->newMrr = $values['newMrr'];
        $this->expansionMrr = $values['expansionMrr'];
        $this->contractionMrr = $values['contractionMrr'];
        $this->churnMrr = $values['churnMrr'];
        $this->netNewMrr = $values['netNewMrr'];
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
