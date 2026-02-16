<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class SubscriptionResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var ?string $externalId
     */
    #[JsonProperty('externalId')]
    public ?string $externalId;

    /**
     * @var string $customerId
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var string $planId
     */
    #[JsonProperty('planId')]
    public string $planId;

    /**
     * @var ?string $previousPlanId
     */
    #[JsonProperty('previousPlanId')]
    public ?string $previousPlanId;

    /**
     * @var value-of<SubscriptionResponseStatus> $status
     */
    #[JsonProperty('status')]
    public string $status;

    /**
     * @var string $currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var value-of<SubscriptionResponseBillingTiming> $billingTiming
     */
    #[JsonProperty('billingTiming')]
    public string $billingTiming;

    /**
     * @var string $currentPeriodStart
     */
    #[JsonProperty('currentPeriodStart')]
    public string $currentPeriodStart;

    /**
     * @var string $currentPeriodEnd
     */
    #[JsonProperty('currentPeriodEnd')]
    public string $currentPeriodEnd;

    /**
     * @var ?string $cancelAt
     */
    #[JsonProperty('cancelAt')]
    public ?string $cancelAt;

    /**
     * @var ?string $canceledAt
     */
    #[JsonProperty('canceledAt')]
    public ?string $canceledAt;

    /**
     * @var ?string $trialStart
     */
    #[JsonProperty('trialStart')]
    public ?string $trialStart;

    /**
     * @var ?string $trialEnd
     */
    #[JsonProperty('trialEnd')]
    public ?string $trialEnd;

    /**
     * @var string $startedAt
     */
    #[JsonProperty('startedAt')]
    public string $startedAt;

    /**
     * @var ?array<string, mixed> $metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @var ?SubscriptionCustomerResponse $customer
     */
    #[JsonProperty('customer')]
    public ?SubscriptionCustomerResponse $customer;

    /**
     * @var ?SubscriptionPlanResponse $plan
     */
    #[JsonProperty('plan')]
    public ?SubscriptionPlanResponse $plan;

    /**
     * @var string $createdAt
     */
    #[JsonProperty('createdAt')]
    public string $createdAt;

    /**
     * @var string $updatedAt
     */
    #[JsonProperty('updatedAt')]
    public string $updatedAt;

    /**
     * @param array{
     *   id: string,
     *   customerId: string,
     *   planId: string,
     *   status: value-of<SubscriptionResponseStatus>,
     *   currency: string,
     *   billingTiming: value-of<SubscriptionResponseBillingTiming>,
     *   currentPeriodStart: string,
     *   currentPeriodEnd: string,
     *   startedAt: string,
     *   createdAt: string,
     *   updatedAt: string,
     *   externalId?: ?string,
     *   previousPlanId?: ?string,
     *   cancelAt?: ?string,
     *   canceledAt?: ?string,
     *   trialStart?: ?string,
     *   trialEnd?: ?string,
     *   metadata?: ?array<string, mixed>,
     *   customer?: ?SubscriptionCustomerResponse,
     *   plan?: ?SubscriptionPlanResponse,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->externalId = $values['externalId'] ?? null;
        $this->customerId = $values['customerId'];
        $this->planId = $values['planId'];
        $this->previousPlanId = $values['previousPlanId'] ?? null;
        $this->status = $values['status'];
        $this->currency = $values['currency'];
        $this->billingTiming = $values['billingTiming'];
        $this->currentPeriodStart = $values['currentPeriodStart'];
        $this->currentPeriodEnd = $values['currentPeriodEnd'];
        $this->cancelAt = $values['cancelAt'] ?? null;
        $this->canceledAt = $values['canceledAt'] ?? null;
        $this->trialStart = $values['trialStart'] ?? null;
        $this->trialEnd = $values['trialEnd'] ?? null;
        $this->startedAt = $values['startedAt'];
        $this->metadata = $values['metadata'] ?? null;
        $this->customer = $values['customer'] ?? null;
        $this->plan = $values['plan'] ?? null;
        $this->createdAt = $values['createdAt'];
        $this->updatedAt = $values['updatedAt'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
