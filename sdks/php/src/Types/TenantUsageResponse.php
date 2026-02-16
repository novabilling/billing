<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class TenantUsageResponse extends JsonSerializableType
{
    /**
     * @var float $customers
     */
    #[JsonProperty('customers')]
    public float $customers;

    /**
     * @var float $activeSubscriptions
     */
    #[JsonProperty('activeSubscriptions')]
    public float $activeSubscriptions;

    /**
     * @var float $totalInvoices
     */
    #[JsonProperty('totalInvoices')]
    public float $totalInvoices;

    /**
     * @var string $totalRevenue
     */
    #[JsonProperty('totalRevenue')]
    public string $totalRevenue;

    /**
     * @param array{
     *   customers: float,
     *   activeSubscriptions: float,
     *   totalInvoices: float,
     *   totalRevenue: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->customers = $values['customers'];
        $this->activeSubscriptions = $values['activeSubscriptions'];
        $this->totalInvoices = $values['totalInvoices'];
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
