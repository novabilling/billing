<?php

namespace NovaBilling\Charges\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Charges\Types\UpdateChargeDtoBillingTiming;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;
use NovaBilling\Types\GraduatedRangeDto;
use NovaBilling\Types\ChargeFilterDto;

class UpdateChargeDto extends JsonSerializableType
{
    /**
     * @var ?value-of<UpdateChargeDtoBillingTiming> $billingTiming
     */
    #[JsonProperty('billingTiming')]
    public ?string $billingTiming;

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
     * @var ?bool $prorated
     */
    #[JsonProperty('prorated')]
    public ?bool $prorated;

    /**
     * @var ?array<string, mixed> $properties
     */
    #[JsonProperty('properties'), ArrayType(['string' => 'mixed'])]
    public ?array $properties;

    /**
     * @var ?array<GraduatedRangeDto> $graduatedRanges
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
     *   billingTiming?: ?value-of<UpdateChargeDtoBillingTiming>,
     *   invoiceDisplayName?: ?string,
     *   minAmountCents?: ?float,
     *   prorated?: ?bool,
     *   properties?: ?array<string, mixed>,
     *   graduatedRanges?: ?array<GraduatedRangeDto>,
     *   filters?: ?array<ChargeFilterDto>,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->billingTiming = $values['billingTiming'] ?? null;
        $this->invoiceDisplayName = $values['invoiceDisplayName'] ?? null;
        $this->minAmountCents = $values['minAmountCents'] ?? null;
        $this->prorated = $values['prorated'] ?? null;
        $this->properties = $values['properties'] ?? null;
        $this->graduatedRanges = $values['graduatedRanges'] ?? null;
        $this->filters = $values['filters'] ?? null;
    }
}
