<?php

namespace NovaBilling\BillableMetrics\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\BillableMetrics\Types\CreateBillableMetricDtoAggregationType;
use NovaBilling\Types\CreateBillableMetricFilterDto;
use NovaBilling\Core\Types\ArrayType;

class CreateBillableMetricDto extends JsonSerializableType
{
    /**
     * @var string $name
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var string $code Unique metric code
     */
    #[JsonProperty('code')]
    public string $code;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var value-of<CreateBillableMetricDtoAggregationType> $aggregationType
     */
    #[JsonProperty('aggregationType')]
    public string $aggregationType;

    /**
     * @var ?string $fieldName Property key to aggregate (required for SUM, MAX, LATEST, WEIGHTED_SUM)
     */
    #[JsonProperty('fieldName')]
    public ?string $fieldName;

    /**
     * @var ?bool $recurring If true, value carries forward across billing periods
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
     *   name: string,
     *   code: string,
     *   aggregationType: value-of<CreateBillableMetricDtoAggregationType>,
     *   description?: ?string,
     *   fieldName?: ?string,
     *   recurring?: ?bool,
     *   filters?: ?array<CreateBillableMetricFilterDto>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->name = $values['name'];
        $this->code = $values['code'];
        $this->description = $values['description'] ?? null;
        $this->aggregationType = $values['aggregationType'];
        $this->fieldName = $values['fieldName'] ?? null;
        $this->recurring = $values['recurring'] ?? null;
        $this->filters = $values['filters'] ?? null;
    }
}
