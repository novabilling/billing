<?php

namespace NovaBilling\Charges\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Charges\Types\CreateChargeDtoChargeModel;
use NovaBilling\Charges\Types\CreateChargeDtoBillingTiming;
use NovaBilling\Core\Types\ArrayType;
use NovaBilling\Types\GraduatedRangeDto;
use NovaBilling\Types\ChargeFilterDto;

class CreateChargeDto extends JsonSerializableType
{
    /**
     * @var string $planId Plan ID to attach this charge to
     */
    #[JsonProperty('planId')]
    public string $planId;

    /**
     * @var string $billableMetricId Billable metric ID
     */
    #[JsonProperty('billableMetricId')]
    public string $billableMetricId;

    /**
     * @var value-of<CreateChargeDtoChargeModel> $chargeModel
     */
    #[JsonProperty('chargeModel')]
    public string $chargeModel;

    /**
     * @var ?value-of<CreateChargeDtoBillingTiming> $billingTiming
     */
    #[JsonProperty('billingTiming')]
    public ?string $billingTiming;

    /**
     * @var ?string $invoiceDisplayName Display name on invoices
     */
    #[JsonProperty('invoiceDisplayName')]
    public ?string $invoiceDisplayName;

    /**
     * @var ?float $minAmountCents Minimum charge in cents
     */
    #[JsonProperty('minAmountCents')]
    public ?float $minAmountCents;

    /**
     * @var ?bool $prorated
     */
    #[JsonProperty('prorated')]
    public ?bool $prorated;

    /**
     * @var ?array<string, mixed> $properties Model-specific config. Standard: { amount, currency }. Package: { amount, packageSize, currency }. Percentage: { rate, fixedAmount, freeUnitsPerEvent, freeUnitsPerTotalAggregation }
     */
    #[JsonProperty('properties'), ArrayType(['string' => 'mixed'])]
    public ?array $properties;

    /**
     * @var ?array<GraduatedRangeDto> $graduatedRanges Required for GRADUATED and VOLUME charge models
     */
    #[JsonProperty('graduatedRanges'), ArrayType([GraduatedRangeDto::class])]
    public ?array $graduatedRanges;

    /**
     * @var ?array<ChargeFilterDto> $filters
     */
    #[JsonProperty('filters'), ArrayType([ChargeFilterDto::class])]
    public ?array $filters;

    /**
     * @param array{
     *   planId: string,
     *   billableMetricId: string,
     *   chargeModel: value-of<CreateChargeDtoChargeModel>,
     *   billingTiming?: ?value-of<CreateChargeDtoBillingTiming>,
     *   invoiceDisplayName?: ?string,
     *   minAmountCents?: ?float,
     *   prorated?: ?bool,
     *   properties?: ?array<string, mixed>,
     *   graduatedRanges?: ?array<GraduatedRangeDto>,
     *   filters?: ?array<ChargeFilterDto>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->planId = $values['planId'];
        $this->billableMetricId = $values['billableMetricId'];
        $this->chargeModel = $values['chargeModel'];
        $this->billingTiming = $values['billingTiming'] ?? null;
        $this->invoiceDisplayName = $values['invoiceDisplayName'] ?? null;
        $this->minAmountCents = $values['minAmountCents'] ?? null;
        $this->prorated = $values['prorated'] ?? null;
        $this->properties = $values['properties'] ?? null;
        $this->graduatedRanges = $values['graduatedRanges'] ?? null;
        $this->filters = $values['filters'] ?? null;
    }
}
