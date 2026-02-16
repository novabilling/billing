<?php

namespace NovaBilling\Coupons\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class ListCouponsRequest extends JsonSerializableType
{
    /**
     * @var ?bool $isActive
     */
    public ?bool $isActive;

    /**
     * @var ?float $page
     */
    public ?float $page;

    /**
     * @var ?float $limit
     */
    public ?float $limit;

    /**
     * @param array{
     *   isActive?: ?bool,
     *   page?: ?float,
     *   limit?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->isActive = $values['isActive'] ?? null;
        $this->page = $values['page'] ?? null;
        $this->limit = $values['limit'] ?? null;
    }
}
