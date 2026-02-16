<?php

namespace NovaBilling\Subscriptions\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;
use NovaBilling\Subscriptions\Types\CreateSubscriptionDtoStatus;

class CreateSubscriptionDto extends JsonSerializableType
{
    /**
     * @var string $customerId Customer ID
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var string $planId Plan ID
     */
    #[JsonProperty('planId')]
    public string $planId;

    /**
     * @var string $currency Currency for billing
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var ?float $trialDays Number of trial days
     */
    #[JsonProperty('trialDays')]
    public ?float $trialDays;

    /**
     * @var ?array<string, mixed> $metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @var ?string $startDate Override subscription start date (ISO 8601). Defaults to now.
     */
    #[JsonProperty('startDate')]
    public ?string $startDate;

    /**
     * @var ?string $currentPeriodEnd Override current period end (ISO 8601). Defaults to calculated from startDate + billing interval.
     */
    #[JsonProperty('currentPeriodEnd')]
    public ?string $currentPeriodEnd;

    /**
     * @var ?value-of<CreateSubscriptionDtoStatus> $status Override subscription status for imports
     */
    #[JsonProperty('status')]
    public ?string $status;

    /**
     * @var ?string $createdAt Backdate createdAt (ISO 8601). For data imports.
     */
    #[JsonProperty('createdAt')]
    public ?string $createdAt;

    /**
     * @var ?string $externalId External ID for linking to external systems
     */
    #[JsonProperty('externalId')]
    public ?string $externalId;

    /**
     * @var ?string $canceledAt Canceled at date (ISO 8601). For importing canceled subscriptions.
     */
    #[JsonProperty('canceledAt')]
    public ?string $canceledAt;

    /**
     * @param array{
     *   customerId: string,
     *   planId: string,
     *   currency: string,
     *   trialDays?: ?float,
     *   metadata?: ?array<string, mixed>,
     *   startDate?: ?string,
     *   currentPeriodEnd?: ?string,
     *   status?: ?value-of<CreateSubscriptionDtoStatus>,
     *   createdAt?: ?string,
     *   externalId?: ?string,
     *   canceledAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->customerId = $values['customerId'];
        $this->planId = $values['planId'];
        $this->currency = $values['currency'];
        $this->trialDays = $values['trialDays'] ?? null;
        $this->metadata = $values['metadata'] ?? null;
        $this->startDate = $values['startDate'] ?? null;
        $this->currentPeriodEnd = $values['currentPeriodEnd'] ?? null;
        $this->status = $values['status'] ?? null;
        $this->createdAt = $values['createdAt'] ?? null;
        $this->externalId = $values['externalId'] ?? null;
        $this->canceledAt = $values['canceledAt'] ?? null;
    }
}
