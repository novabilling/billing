<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class BillableMetricResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $name
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var string $code
     */
    #[JsonProperty('code')]
    public string $code;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var value-of<BillableMetricResponseAggregationType> $aggregationType
     */
    #[JsonProperty('aggregationType')]
    public string $aggregationType;

    /**
     * @var ?string $fieldName
     */
    #[JsonProperty('fieldName')]
    public ?string $fieldName;

    /**
     * @var bool $recurring
     */
    #[JsonProperty('recurring')]
    public bool $recurring;

    /**
     * @var array<BillableMetricFilterResponse> $filters
     */
    #[JsonProperty('filters'), ArrayType([BillableMetricFilterResponse::class])]
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
     *   name: string,
     *   code: string,
     *   aggregationType: value-of<BillableMetricResponseAggregationType>,
     *   recurring: bool,
     *   filters: array<BillableMetricFilterResponse>,
     *   createdAt: string,
     *   updatedAt: string,
     *   description?: ?string,
     *   fieldName?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->name = $values['name'];
        $this->code = $values['code'];
        $this->description = $values['description'] ?? null;
        $this->aggregationType = $values['aggregationType'];
        $this->fieldName = $values['fieldName'] ?? null;
        $this->recurring = $values['recurring'];
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
