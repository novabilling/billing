<?php

namespace NovaBilling\Analytics\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Analytics\Types\GetCustomersAnalyticsRequestGroupBy;

class GetCustomersAnalyticsRequest extends JsonSerializableType
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
     * @var ?value-of<GetCustomersAnalyticsRequestGroupBy> $groupBy
     */
    public ?string $groupBy;

    /**
     * @param array{
     *   dateFrom?: ?string,
     *   dateTo?: ?string,
     *   currency?: ?string,
     *   groupBy?: ?value-of<GetCustomersAnalyticsRequestGroupBy>,
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
