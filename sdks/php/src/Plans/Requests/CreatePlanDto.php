<?php

namespace NovaBilling\Plans\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Plans\Types\CreatePlanDtoBillingInterval;
use NovaBilling\Plans\Types\CreatePlanDtoBillingTiming;
use NovaBilling\Core\Types\ArrayType;
use NovaBilling\Types\CreatePlanPriceDto;

class CreatePlanDto extends JsonSerializableType
{
    /**
     * @var string $name
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var string $code Unique plan code (lowercase, underscores)
     */
    #[JsonProperty('code')]
    public string $code;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var value-of<CreatePlanDtoBillingInterval> $billingInterval
     */
    #[JsonProperty('billingInterval')]
    public string $billingInterval;

    /**
     * @var ?value-of<CreatePlanDtoBillingTiming> $billingTiming When to charge: IN_ADVANCE (at period start) or IN_ARREARS (at period end). Defaults to IN_ARREARS.
     */
    #[JsonProperty('billingTiming')]
    public ?string $billingTiming;

    /**
     * @var ?array<string> $features
     */
    #[JsonProperty('features'), ArrayType(['string'])]
    public ?array $features;

    /**
     * @var ?array<CreatePlanPriceDto> $prices
     */
    #[JsonProperty('prices'), ArrayType([CreatePlanPriceDto::class])]
    public ?array $prices;

    /**
     * @var ?float $netPaymentTerms Net payment terms in days (overrides org default)
     */
    #[JsonProperty('netPaymentTerms')]
    public ?float $netPaymentTerms;

    /**
     * @var ?float $invoiceGracePeriodDays Grace period in days before draft invoices are finalized
     */
    #[JsonProperty('invoiceGracePeriodDays')]
    public ?float $invoiceGracePeriodDays;

    /**
     * @var ?float $progressiveBillingThreshold Usage cost threshold for mid-cycle progressive billing invoices
     */
    #[JsonProperty('progressiveBillingThreshold')]
    public ?float $progressiveBillingThreshold;

    /**
     * @param array{
     *   name: string,
     *   code: string,
     *   billingInterval: value-of<CreatePlanDtoBillingInterval>,
     *   description?: ?string,
     *   billingTiming?: ?value-of<CreatePlanDtoBillingTiming>,
     *   features?: ?array<string>,
     *   prices?: ?array<CreatePlanPriceDto>,
     *   netPaymentTerms?: ?float,
     *   invoiceGracePeriodDays?: ?float,
     *   progressiveBillingThreshold?: ?float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->name = $values['name'];
        $this->code = $values['code'];
        $this->description = $values['description'] ?? null;
        $this->billingInterval = $values['billingInterval'];
        $this->billingTiming = $values['billingTiming'] ?? null;
        $this->features = $values['features'] ?? null;
        $this->prices = $values['prices'] ?? null;
        $this->netPaymentTerms = $values['netPaymentTerms'] ?? null;
        $this->invoiceGracePeriodDays = $values['invoiceGracePeriodDays'] ?? null;
        $this->progressiveBillingThreshold = $values['progressiveBillingThreshold'] ?? null;
    }
}
