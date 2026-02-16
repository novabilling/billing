<?php

namespace NovaBilling\Analytics\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class GetChurnCohortsAnalyticsRequest extends JsonSerializableType
{
    /**
     * @var ?float $months Number of months to analyze (default 12)
     */
    public ?float $months;

    /**
     * @param array{
     *   months?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->months = $values['months'] ?? null;
    }
}
