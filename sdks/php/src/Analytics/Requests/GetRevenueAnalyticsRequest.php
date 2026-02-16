<?php

namespace NovaBilling\Analytics\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Analytics\Types\GetRevenueAnalyticsRequestGroupBy;

class GetRevenueAnalyticsRequest extends JsonSerializableType
{
    /**
     * @var ?string $dateFrom
     */
    public ?string $dateFrom;

    /**
     * @var ?string $dateTo
     */
    public ?string $dateTo;

    /**
     * @var ?string $currency
     */
    public ?string $currency;

    /**
     * @var ?value-of<GetRevenueAnalyticsRequestGroupBy> $groupBy
     */
    public ?string $groupBy;

    /**
     * @param array{
     *   dateFrom?: ?string,
     *   dateTo?: ?string,
     *   currency?: ?string,
     *   groupBy?: ?value-of<GetRevenueAnalyticsRequestGroupBy>,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->dateFrom = $values['dateFrom'] ?? null;
        $this->dateTo = $values['dateTo'] ?? null;
        $this->currency = $values['currency'] ?? null;
        $this->groupBy = $values['groupBy'] ?? null;
    }
}
