<?php

namespace NovaBilling\PlanOverrides\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class CreatePlanOverrideDto extends JsonSerializableType
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
     * @var ?array<string> $overriddenPrices Override plan prices: array of { currency, amount }
     */
    #[JsonProperty('overriddenPrices'), ArrayType(['string'])]
    public ?array $overriddenPrices;

    /**
     * @var ?float $overriddenMinimumCommitment Override minimum commitment amount
     */
    #[JsonProperty('overriddenMinimumCommitment')]
    public ?float $overriddenMinimumCommitment;

    /**
     * @var ?array<string> $overriddenCharges Override charge properties: array of { chargeId, properties?, graduatedRanges? }
     */
    #[JsonProperty('overriddenCharges'), ArrayType(['string'])]
    public ?array $overriddenCharges;

    /**
     * @var ?array<string, mixed> $metadata Custom metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @param array{
     *   customerId: string,
     *   planId: string,
     *   overriddenPrices?: ?array<string>,
     *   overriddenMinimumCommitment?: ?float,
     *   overriddenCharges?: ?array<string>,
     *   metadata?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->customerId = $values['customerId'];
        $this->planId = $values['planId'];
        $this->overriddenPrices = $values['overriddenPrices'] ?? null;
        $this->overriddenMinimumCommitment = $values['overriddenMinimumCommitment'] ?? null;
        $this->overriddenCharges = $values['overriddenCharges'] ?? null;
        $this->metadata = $values['metadata'] ?? null;
    }
}
