<?php

namespace NovaBilling\AddOns\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class ListAppliedAddOnsRequest extends JsonSerializableType
{
    /**
     * @var ?string $customerId
     */
    public ?string $customerId;

    /**
     * @var ?bool $invoiced
     */
    public ?bool $invoiced;

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
     *   customerId?: ?string,
     *   invoiced?: ?bool,
     *   page?: ?float,
     *   limit?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->customerId = $values['customerId'] ?? null;
        $this->invoiced = $values['invoiced'] ?? null;
        $this->page = $values['page'] ?? null;
        $this->limit = $values['limit'] ?? null;
    }
}
