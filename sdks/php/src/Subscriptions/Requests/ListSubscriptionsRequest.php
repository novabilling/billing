<?php

namespace NovaBilling\Subscriptions\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class ListSubscriptionsRequest extends JsonSerializableType
{
    /**
     * @var ?string $status Filter by status (ACTIVE, TRIALING, PAUSED, CANCELED)
     */
    public ?string $status;

    /**
     * @var ?string $customerId Filter by customer ID
     */
    public ?string $customerId;

    /**
     * @var ?string $planId Filter by plan ID
     */
    public ?string $planId;

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
     *   status?: ?string,
     *   customerId?: ?string,
     *   planId?: ?string,
     *   page?: ?float,
     *   limit?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->status = $values['status'] ?? null;
        $this->customerId = $values['customerId'] ?? null;
        $this->planId = $values['planId'] ?? null;
        $this->page = $values['page'] ?? null;
        $this->limit = $values['limit'] ?? null;
    }
}
