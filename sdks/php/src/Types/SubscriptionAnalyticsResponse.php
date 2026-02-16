<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class SubscriptionAnalyticsResponse extends JsonSerializableType
{
    /**
     * @var float $total
     */
    #[JsonProperty('total')]
    public float $total;

    /**
     * @var float $active
     */
    #[JsonProperty('active')]
    public float $active;

    /**
     * @var float $canceled
     */
    #[JsonProperty('canceled')]
    public float $canceled;

    /**
     * @var float $trialing
     */
    #[JsonProperty('trialing')]
    public float $trialing;

    /**
     * @var float $paused
     */
    #[JsonProperty('paused')]
    public float $paused;

    /**
     * @var float $newSubscriptions
     */
    #[JsonProperty('newSubscriptions')]
    public float $newSubscriptions;

    /**
     * @var string $churnRate Churn rate percentage
     */
    #[JsonProperty('churnRate')]
    public string $churnRate;

    /**
     * @var string $retentionRate Retention rate percentage
     */
    #[JsonProperty('retentionRate')]
    public string $retentionRate;

    /**
     * @param array{
     *   total: float,
     *   active: float,
     *   canceled: float,
     *   trialing: float,
     *   paused: float,
     *   newSubscriptions: float,
     *   churnRate: string,
     *   retentionRate: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->total = $values['total'];
        $this->active = $values['active'];
        $this->canceled = $values['canceled'];
        $this->trialing = $values['trialing'];
        $this->paused = $values['paused'];
        $this->newSubscriptions = $values['newSubscriptions'];
        $this->churnRate = $values['churnRate'];
        $this->retentionRate = $values['retentionRate'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
