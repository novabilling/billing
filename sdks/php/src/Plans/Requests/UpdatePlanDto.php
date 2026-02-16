<?php

namespace NovaBilling\Plans\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Plans\Types\UpdatePlanDtoBillingInterval;
use NovaBilling\Plans\Types\UpdatePlanDtoBillingTiming;
use NovaBilling\Core\Types\ArrayType;

class UpdatePlanDto extends JsonSerializableType
{
    /**
     * @var ?string $name
     */
    #[JsonProperty('name')]
    public ?string $name;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var ?value-of<UpdatePlanDtoBillingInterval> $billingInterval
     */
    #[JsonProperty('billingInterval')]
    public ?string $billingInterval;

    /**
     * @var ?value-of<UpdatePlanDtoBillingTiming> $billingTiming When to charge: IN_ADVANCE or IN_ARREARS
     */
    #[JsonProperty('billingTiming')]
    public ?string $billingTiming;

    /**
     * @var ?array<string> $features
     */
    #[JsonProperty('features'), ArrayType(['string'])]
    public ?array $features;

    /**
     * @var ?bool $isActive
     */
    #[JsonProperty('isActive')]
    public ?bool $isActive;

    /**
     * @var ?float $netPaymentTerms Net payment terms in days
     */
    #[JsonProperty('netPaymentTerms')]
    public ?float $netPaymentTerms;

    /**
     * @var ?float $invoiceGracePeriodDays Grace period in days before draft invoices are finalized
     */
    #[JsonProperty('invoiceGracePeriodDays')]
    public ?float $invoiceGracePeriodDays;

    /**
     * @var ?float $progressiveBillingThreshold Usage cost threshold for progressive billing
     */
    #[JsonProperty('progressiveBillingThreshold')]
    public ?float $progressiveBillingThreshold;

    /**
     * @param array{
     *   name?: ?string,
     *   description?: ?string,
     *   billingInterval?: ?value-of<UpdatePlanDtoBillingInterval>,
     *   billingTiming?: ?value-of<UpdatePlanDtoBillingTiming>,
     *   features?: ?array<string>,
     *   isActive?: ?bool,
     *   netPaymentTerms?: ?float,
     *   invoiceGracePeriodDays?: ?float,
     *   progressiveBillingThreshold?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->name = $values['name'] ?? null;
        $this->description = $values['description'] ?? null;
        $this->billingInterval = $values['billingInterval'] ?? null;
        $this->billingTiming = $values['billingTiming'] ?? null;
        $this->features = $values['features'] ?? null;
        $this->isActive = $values['isActive'] ?? null;
        $this->netPaymentTerms = $values['netPaymentTerms'] ?? null;
        $this->invoiceGracePeriodDays = $values['invoiceGracePeriodDays'] ?? null;
        $this->progressiveBillingThreshold = $values['progressiveBillingThreshold'] ?? null;
    }
}
