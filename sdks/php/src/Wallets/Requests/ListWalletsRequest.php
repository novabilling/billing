<?php

namespace NovaBilling\Wallets\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Wallets\Types\ListWalletsRequestStatus;

class ListWalletsRequest extends JsonSerializableType
{
    /**
     * @var ?string $customerId
     */
    public ?string $customerId;

    /**
     * @var ?value-of<ListWalletsRequestStatus> $status
     */
    public ?string $status;

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
     *   status?: ?value-of<ListWalletsRequestStatus>,
     *   page?: ?float,
     *   limit?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->customerId = $values['customerId'] ?? null;
        $this->status = $values['status'] ?? null;
        $this->page = $values['page'] ?? null;
        $this->limit = $values['limit'] ?? null;
    }
}
