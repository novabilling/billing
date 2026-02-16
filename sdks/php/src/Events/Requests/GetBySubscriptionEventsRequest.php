<?php

namespace NovaBilling\Events\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class GetBySubscriptionEventsRequest extends JsonSerializableType
{
    /**
     * @var ?string $code Filter by metric code
     */
    public ?string $code;

    /**
     * @var ?string $from Start date (ISO 8601)
     */
    public ?string $from;

    /**
     * @var ?string $to End date (ISO 8601)
     */
    public ?string $to;

    /**
     * @var ?float $page
     */
    public ?float $page;

    /**
     * @var ?float $perPage
     */
    public ?float $perPage;

    /**
     * @param array{
     *   code?: ?string,
     *   from?: ?string,
     *   to?: ?string,
     *   page?: ?float,
     *   perPage?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->code = $values['code'] ?? null;
        $this->from = $values['from'] ?? null;
        $this->to = $values['to'] ?? null;
        $this->page = $values['page'] ?? null;
        $this->perPage = $values['perPage'] ?? null;
    }
}
