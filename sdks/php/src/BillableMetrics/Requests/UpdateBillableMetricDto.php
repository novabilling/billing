<?php

namespace NovaBilling\BillableMetrics\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Types\CreateBillableMetricFilterDto;
use NovaBilling\Core\Types\ArrayType;

class UpdateBillableMetricDto extends JsonSerializableType
{
    /**
     * @var ?string $name
     */
    #[JsonProperty('name')]
    public ?string $name;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var ?string $fieldName
     */
    #[JsonProperty('fieldName')]
    public ?string $fieldName;

    /**
     * @var ?bool $recurring
     */
    #[JsonProperty('recurring')]
    public ?bool $recurring;

    /**
     * @var ?array<CreateBillableMetricFilterDto> $filters
     */
    #[JsonProperty('filters'), ArrayType([CreateBillableMetricFilterDto::class])]
    public ?array $filters;

    /**
     * @param array{
     *   name?: ?string,
     *   description?: ?string,
     *   fieldName?: ?string,
     *   recurring?: ?bool,
     *   filters?: ?array<CreateBillableMetricFilterDto>,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->name = $values['name'] ?? null;
        $this->description = $values['description'] ?? null;
        $this->fieldName = $values['fieldName'] ?? null;
        $this->recurring = $values['recurring'] ?? null;
        $this->filters = $values['filters'] ?? null;
    }
}
