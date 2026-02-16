<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class ChargeFilterDto extends JsonSerializableType
{
    /**
     * @var string $key Filter key (must match metric filter)
     */
    #[JsonProperty('key')]
    public string $key;

    /**
     * @var array<string> $values Subset of allowed values
     */
    #[JsonProperty('values'), ArrayType(['string'])]
    public array $values;

    /**
     * @var ?array<string, mixed> $properties Override properties for this filter
     */
    #[JsonProperty('properties'), ArrayType(['string' => 'mixed'])]
    public ?array $properties;

    /**
     * @param array{
     *   key: string,
     *   values: array<string>,
     *   properties?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->key = $values['key'];
        $this->values = $values['values'];
        $this->properties = $values['properties'] ?? null;
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
