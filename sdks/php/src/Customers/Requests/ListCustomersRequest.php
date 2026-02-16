<?php

namespace NovaBilling\Customers\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Customers\Types\ListCustomersRequestSortOrder;

class ListCustomersRequest extends JsonSerializableType
{
    /**
     * @var ?float $page
     */
    public ?float $page;

    /**
     * @var ?float $limit
     */
    public ?float $limit;

    /**
     * @var ?string $search Search by name or email
     */
    public ?string $search;

    /**
     * @var ?string $country
     */
    public ?string $country;

    /**
     * @var ?string $currency
     */
    public ?string $currency;

    /**
     * @var ?string $sortBy
     */
    public ?string $sortBy;

    /**
     * @var ?value-of<ListCustomersRequestSortOrder> $sortOrder
     */
    public ?string $sortOrder;

    /**
     * @param array{
     *   page?: ?float,
     *   limit?: ?float,
     *   search?: ?string,
     *   country?: ?string,
     *   currency?: ?string,
     *   sortBy?: ?string,
     *   sortOrder?: ?value-of<ListCustomersRequestSortOrder>,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->page = $values['page'] ?? null;
        $this->limit = $values['limit'] ?? null;
        $this->search = $values['search'] ?? null;
        $this->country = $values['country'] ?? null;
        $this->currency = $values['currency'] ?? null;
        $this->sortBy = $values['sortBy'] ?? null;
        $this->sortOrder = $values['sortOrder'] ?? null;
    }
}
