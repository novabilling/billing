<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class PaginatedPlanOverrideResponse extends JsonSerializableType
{
    /**
     * @var array<PlanOverrideResponse> $data
     */
    #[JsonProperty('data'), ArrayType([PlanOverrideResponse::class])]
    public array $data;

    /**
     * @var array<string, mixed> $meta
     */
    #[JsonProperty('meta'), ArrayType(['string' => 'mixed'])]
    public array $meta;

    /**
     * @param array{
     *   data: array<PlanOverrideResponse>,
     *   meta: array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->data = $values['data'];
        $this->meta = $values['meta'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
