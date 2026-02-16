<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class ChargeResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $planId
     */
    #[JsonProperty('planId')]
    public string $planId;

    /**
     * @var string $billableMetricId
     */
    #[JsonProperty('billableMetricId')]
    public string $billableMetricId;

    /**
     * @var value-of<ChargeResponseChargeModel> $chargeModel
     */
    #[JsonProperty('chargeModel')]
    public string $chargeModel;

    /**
     * @var value-of<ChargeResponseBillingTiming> $billingTiming
     */
    #[JsonProperty('billingTiming')]
    public string $billingTiming;

    /**
     * @var ?string $invoiceDisplayName
     */
    #[JsonProperty('invoiceDisplayName')]
    public ?string $invoiceDisplayName;

    /**
     * @var ?float $minAmountCents
     */
    #[JsonProperty('minAmountCents')]
    public ?float $minAmountCents;

    /**
     * @var bool $prorated
     */
    #[JsonProperty('prorated')]
    public bool $prorated;

    /**
     * @var ?array<string, mixed> $properties Model-specific config
     */
    #[JsonProperty('properties'), ArrayType(['string' => 'mixed'])]
    public ?array $properties;

    /**
     * @var array<ChargeGraduatedRangeResponse> $graduatedRanges
     */
    #[JsonProperty('graduatedRanges'), ArrayType([ChargeGraduatedRangeResponse::class])]
    public array $graduatedRanges;

    /**
     * @var array<ChargeFilterResponse> $filters
     */
    #[JsonProperty('filters'), ArrayType([ChargeFilterResponse::class])]
    public array $filters;

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
     *   planId: string,
     *   billableMetricId: string,
     *   chargeModel: value-of<ChargeResponseChargeModel>,
     *   billingTiming: value-of<ChargeResponseBillingTiming>,
     *   prorated: bool,
     *   graduatedRanges: array<ChargeGraduatedRangeResponse>,
     *   filters: array<ChargeFilterResponse>,
     *   createdAt: string,
     *   updatedAt: string,
     *   invoiceDisplayName?: ?string,
     *   minAmountCents?: ?float,
     *   properties?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->planId = $values['planId'];
        $this->billableMetricId = $values['billableMetricId'];
        $this->chargeModel = $values['chargeModel'];
        $this->billingTiming = $values['billingTiming'];
        $this->invoiceDisplayName = $values['invoiceDisplayName'] ?? null;
        $this->minAmountCents = $values['minAmountCents'] ?? null;
        $this->prorated = $values['prorated'];
        $this->properties = $values['properties'] ?? null;
        $this->graduatedRanges = $values['graduatedRanges'];
        $this->filters = $values['filters'];
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
