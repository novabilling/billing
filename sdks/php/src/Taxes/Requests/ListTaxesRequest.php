<?php

namespace NovaBilling\Taxes\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class ListTaxesRequest extends JsonSerializableType
{
    /**
     * @var ?bool $appliedByDefault
     */
    public ?bool $appliedByDefault;

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
     *   appliedByDefault?: ?bool,
     *   page?: ?float,
     *   limit?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->appliedByDefault = $values['appliedByDefault'] ?? null;
        $this->page = $values['page'] ?? null;
        $this->limit = $values['limit'] ?? null;
    }
}
