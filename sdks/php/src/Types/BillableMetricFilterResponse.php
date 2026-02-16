<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class BillableMetricFilterResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $billableMetricId
     */
    #[JsonProperty('billableMetricId')]
    public string $billableMetricId;

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
     * @param array{
     *   id: string,
     *   billableMetricId: string,
     *   key: string,
     *   values: array<string>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->billableMetricId = $values['billableMetricId'];
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
