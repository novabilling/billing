<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class PaginatedSubscriptionResponse extends JsonSerializableType
{
    /**
     * @var array<SubscriptionResponse> $data
     */
    #[JsonProperty('data'), ArrayType([SubscriptionResponse::class])]
    public array $data;

    /**
     * @var PaginationMeta $meta
     */
    #[JsonProperty('meta')]
    public PaginationMeta $meta;

    /**
     * @param array{
     *   data: array<SubscriptionResponse>,
     *   meta: PaginationMeta,
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
