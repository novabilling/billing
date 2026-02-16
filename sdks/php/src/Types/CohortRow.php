<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class CohortRow extends JsonSerializableType
{
    /**
     * @var string $month
     */
    #[JsonProperty('month')]
    public string $month;

    /**
     * @var float $totalCustomers
     */
    #[JsonProperty('totalCustomers')]
    public float $totalCustomers;

    /**
     * @var array<float> $retentionPercentages
     */
    #[JsonProperty('retentionPercentages'), ArrayType(['float'])]
    public array $retentionPercentages;

    /**
     * @param array{
     *   month: string,
     *   totalCustomers: float,
     *   retentionPercentages: array<float>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->month = $values['month'];
        $this->totalCustomers = $values['totalCustomers'];
        $this->retentionPercentages = $values['retentionPercentages'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
