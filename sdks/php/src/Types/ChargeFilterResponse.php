<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class ChargeFilterResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $chargeId
     */
    #[JsonProperty('chargeId')]
    public string $chargeId;

    /**
     * @var string $key
     */
    #[JsonProperty('key')]
    public string $key;

    /**
     * @var array<string> $values
     */
    #[JsonProperty('values'), ArrayType(['string'])]
    public array $values;

    /**
     * @var ?array<string, mixed> $properties
     */
    #[JsonProperty('properties'), ArrayType(['string' => 'mixed'])]
    public ?array $properties;

    /**
     * @param array{
     *   id: string,
     *   chargeId: string,
     *   key: string,
     *   values: array<string>,
     *   properties?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->chargeId = $values['chargeId'];
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
