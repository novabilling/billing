<?php

namespace NovaBilling\Charges\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class ListChargesRequest extends JsonSerializableType
{
    /**
     * @var ?string $planId Filter by plan ID
     */
    public ?string $planId;

    /**
     * @param array{
     *   planId?: ?string,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->planId = $values['planId'] ?? null;
    }
}
