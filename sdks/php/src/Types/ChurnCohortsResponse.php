<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class ChurnCohortsResponse extends JsonSerializableType
{
    /**
     * @var array<string> $months
     */
    #[JsonProperty('months'), ArrayType(['string'])]
    public array $months;

    /**
     * @var array<CohortRow> $cohorts
     */
    #[JsonProperty('cohorts'), ArrayType([CohortRow::class])]
    public array $cohorts;

    /**
     * @param array{
     *   months: array<string>,
     *   cohorts: array<CohortRow>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->months = $values['months'];
        $this->cohorts = $values['cohorts'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
