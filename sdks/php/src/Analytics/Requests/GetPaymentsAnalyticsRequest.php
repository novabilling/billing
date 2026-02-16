<?php

namespace NovaBilling\Analytics\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Analytics\Types\GetPaymentsAnalyticsRequestGroupBy;

class GetPaymentsAnalyticsRequest extends JsonSerializableType
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
     * @var ?value-of<GetPaymentsAnalyticsRequestGroupBy> $groupBy
     */
    public ?string $groupBy;

    /**
     * @var ?string $provider Filter by payment provider name
     */
    public ?string $provider;

    /**
     * @param array{
     *   dateFrom?: ?string,
     *   dateTo?: ?string,
     *   currency?: ?string,
     *   groupBy?: ?value-of<GetPaymentsAnalyticsRequestGroupBy>,
     *   provider?: ?string,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->dateFrom = $values['dateFrom'] ?? null;
        $this->dateTo = $values['dateTo'] ?? null;
        $this->currency = $values['currency'] ?? null;
        $this->groupBy = $values['groupBy'] ?? null;
        $this->provider = $values['provider'] ?? null;
    }
}
