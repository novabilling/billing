<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class PaymentAnalyticsResponse extends JsonSerializableType
{
    /**
     * @var float $totalPayments
     */
    #[JsonProperty('totalPayments')]
    public float $totalPayments;

    /**
     * @var float $succeeded
     */
    #[JsonProperty('succeeded')]
    public float $succeeded;

    /**
     * @var float $failed
     */
    #[JsonProperty('failed')]
    public float $failed;

    /**
     * @var float $pending
     */
    #[JsonProperty('pending')]
    public float $pending;

    /**
     * @var string $successRate Success rate percentage
     */
    #[JsonProperty('successRate')]
    public string $successRate;

    /**
     * @param array{
     *   totalPayments: float,
     *   succeeded: float,
     *   failed: float,
     *   pending: float,
     *   successRate: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->totalPayments = $values['totalPayments'];
        $this->succeeded = $values['succeeded'];
        $this->failed = $values['failed'];
        $this->pending = $values['pending'];
        $this->successRate = $values['successRate'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
