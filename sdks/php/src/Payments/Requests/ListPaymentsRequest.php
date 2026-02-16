<?php

namespace NovaBilling\Payments\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class ListPaymentsRequest extends JsonSerializableType
{
    /**
     * @var ?string $status
     */
    public ?string $status;

    /**
     * @var ?string $provider
     */
    public ?string $provider;

    /**
     * @var ?string $invoiceId
     */
    public ?string $invoiceId;

    /**
     * @var ?string $dateFrom
     */
    public ?string $dateFrom;

    /**
     * @var ?string $dateTo
     */
    public ?string $dateTo;

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
     *   provider?: ?string,
     *   invoiceId?: ?string,
     *   dateFrom?: ?string,
     *   dateTo?: ?string,
     *   page?: ?float,
     *   limit?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->status = $values['status'] ?? null;
        $this->provider = $values['provider'] ?? null;
        $this->invoiceId = $values['invoiceId'] ?? null;
        $this->dateFrom = $values['dateFrom'] ?? null;
        $this->dateTo = $values['dateTo'] ?? null;
        $this->page = $values['page'] ?? null;
        $this->limit = $values['limit'] ?? null;
    }
}
