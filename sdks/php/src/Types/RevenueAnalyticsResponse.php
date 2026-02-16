<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class RevenueAnalyticsResponse extends JsonSerializableType
{
    /**
     * @var string $totalRevenue Total revenue as decimal string
     */
    #[JsonProperty('totalRevenue')]
    public string $totalRevenue;

    /**
     * @var float $invoiceCount
     */
    #[JsonProperty('invoiceCount')]
    public float $invoiceCount;

    /**
     * @var string $mrr Monthly recurring revenue
     */
    #[JsonProperty('mrr')]
    public string $mrr;

    /**
     * @var string $arr Annual recurring revenue
     */
    #[JsonProperty('arr')]
    public string $arr;

    /**
     * @param array{
     *   totalRevenue: string,
     *   invoiceCount: float,
     *   mrr: string,
     *   arr: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->totalRevenue = $values['totalRevenue'];
        $this->invoiceCount = $values['invoiceCount'];
        $this->mrr = $values['mrr'];
        $this->arr = $values['arr'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
