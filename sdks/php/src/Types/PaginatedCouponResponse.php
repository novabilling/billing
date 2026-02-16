<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class PaginatedCouponResponse extends JsonSerializableType
{
    /**
     * @var array<CouponResponse> $data
     */
    #[JsonProperty('data'), ArrayType([CouponResponse::class])]
    public array $data;

    /**
     * @var PaginationMeta $meta
     */
    #[JsonProperty('meta')]
    public PaginationMeta $meta;

    /**
     * @param array{
     *   data: array<CouponResponse>,
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
