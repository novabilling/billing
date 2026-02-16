<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class CreateBillableMetricFilterDto extends JsonSerializableType
{
    /**
     * @var string $key Property key to filter on
     */
    #[JsonProperty('key')]
    public string $key;

    /**
     * @var array<string> $values Allowed values
     */
    #[JsonProperty('values'), ArrayType(['string'])]
    public array $values;

    /**
     * @param array{
     *   key: string,
     *   values: array<string>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->key = $values['key'];
        $this->values = $values['values'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
