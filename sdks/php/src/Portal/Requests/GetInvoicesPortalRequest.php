<?php

namespace NovaBilling\Portal\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Portal\Types\GetInvoicesPortalRequestStatus;

class GetInvoicesPortalRequest extends JsonSerializableType
{
    /**
     * @var ?value-of<GetInvoicesPortalRequestStatus> $status
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
     *   status?: ?value-of<GetInvoicesPortalRequestStatus>,
     *   page?: ?float,
     *   limit?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->status = $values['status'] ?? null;
        $this->page = $values['page'] ?? null;
        $this->limit = $values['limit'] ?? null;
    }
}
