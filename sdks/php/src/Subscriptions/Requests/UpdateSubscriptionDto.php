<?php

namespace NovaBilling\Subscriptions\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class UpdateSubscriptionDto extends JsonSerializableType
{
    /**
     * @var ?array<string, mixed> $metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @param array{
     *   metadata?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->metadata = $values['metadata'] ?? null;
    }
}
