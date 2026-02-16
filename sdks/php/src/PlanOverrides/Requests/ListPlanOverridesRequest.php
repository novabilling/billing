<?php

namespace NovaBilling\PlanOverrides\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class ListPlanOverridesRequest extends JsonSerializableType
{
    /**
     * @var ?string $customerId
     */
    public ?string $customerId;

    /**
     * @var ?string $planId
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
     *   customerId?: ?string,
     *   planId?: ?string,
     *   page?: ?float,
     *   limit?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->customerId = $values['customerId'] ?? null;
        $this->planId = $values['planId'] ?? null;
        $this->page = $values['page'] ?? null;
        $this->limit = $values['limit'] ?? null;
    }
}
