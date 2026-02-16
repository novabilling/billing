<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class NetRevenueResponse extends JsonSerializableType
{
    /**
     * @var float $grossRevenue
     */
    #[JsonProperty('grossRevenue')]
    public float $grossRevenue;

    /**
     * @var float $refunds
     */
    #[JsonProperty('refunds')]
    public float $refunds;

    /**
     * @var float $creditNotes
     */
    #[JsonProperty('creditNotes')]
    public float $creditNotes;

    /**
     * @var float $netRevenue
     */
    #[JsonProperty('netRevenue')]
    public float $netRevenue;

    /**
     * @param array{
     *   grossRevenue: float,
     *   refunds: float,
     *   creditNotes: float,
     *   netRevenue: float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->grossRevenue = $values['grossRevenue'];
        $this->refunds = $values['refunds'];
        $this->creditNotes = $values['creditNotes'];
        $this->netRevenue = $values['netRevenue'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
