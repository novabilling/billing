<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;
use DateTime;
use NovaBilling\Core\Types\Date;

class PlanOverrideResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

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
     * @var ?array<string, mixed> $overriddenPrices
     */
    #[JsonProperty('overriddenPrices'), ArrayType(['string' => 'mixed'])]
    public ?array $overriddenPrices;

    /**
     * @var ?float $overriddenMinimumCommitment
     */
    #[JsonProperty('overriddenMinimumCommitment')]
    public ?float $overriddenMinimumCommitment;

    /**
     * @var ?array<string, mixed> $overriddenCharges
     */
    #[JsonProperty('overriddenCharges'), ArrayType(['string' => 'mixed'])]
    public ?array $overriddenCharges;

    /**
     * @var ?array<string, mixed> $metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @var DateTime $createdAt
     */
    #[JsonProperty('createdAt'), Date(Date::TYPE_DATETIME)]
    public DateTime $createdAt;

    /**
     * @var DateTime $updatedAt
     */
    #[JsonProperty('updatedAt'), Date(Date::TYPE_DATETIME)]
    public DateTime $updatedAt;

    /**
     * @param array{
     *   id: string,
     *   customerId: string,
     *   planId: string,
     *   createdAt: DateTime,
     *   updatedAt: DateTime,
     *   overriddenPrices?: ?array<string, mixed>,
     *   overriddenMinimumCommitment?: ?float,
     *   overriddenCharges?: ?array<string, mixed>,
     *   metadata?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->customerId = $values['customerId'];
        $this->planId = $values['planId'];
        $this->overriddenPrices = $values['overriddenPrices'] ?? null;
        $this->overriddenMinimumCommitment = $values['overriddenMinimumCommitment'] ?? null;
        $this->overriddenCharges = $values['overriddenCharges'] ?? null;
        $this->metadata = $values['metadata'] ?? null;
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
