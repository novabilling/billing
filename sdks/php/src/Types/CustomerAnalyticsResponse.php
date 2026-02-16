<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class CustomerAnalyticsResponse extends JsonSerializableType
{
    /**
     * @var float $totalCustomers
     */
    #[JsonProperty('totalCustomers')]
    public float $totalCustomers;

    /**
     * @var float $newCustomers
     */
    #[JsonProperty('newCustomers')]
    public float $newCustomers;

    /**
     * @var string $arpu Average revenue per user
     */
    #[JsonProperty('arpu')]
    public string $arpu;

    /**
     * @var string $totalRevenue
     */
    #[JsonProperty('totalRevenue')]
    public string $totalRevenue;

    /**
     * @param array{
     *   totalCustomers: float,
     *   newCustomers: float,
     *   arpu: string,
     *   totalRevenue: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->totalCustomers = $values['totalCustomers'];
        $this->newCustomers = $values['newCustomers'];
        $this->arpu = $values['arpu'];
        $this->totalRevenue = $values['totalRevenue'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
