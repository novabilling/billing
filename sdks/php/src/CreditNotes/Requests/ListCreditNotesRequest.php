<?php

namespace NovaBilling\CreditNotes\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\CreditNotes\Types\ListCreditNotesRequestStatus;

class ListCreditNotesRequest extends JsonSerializableType
{
    /**
     * @var ?string $customerId
     */
    public ?string $customerId;

    /**
     * @var ?string $invoiceId
     */
    public ?string $invoiceId;

    /**
     * @var ?value-of<ListCreditNotesRequestStatus> $status
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
     *   customerId?: ?string,
     *   invoiceId?: ?string,
     *   status?: ?value-of<ListCreditNotesRequestStatus>,
     *   page?: ?float,
     *   limit?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->customerId = $values['customerId'] ?? null;
        $this->invoiceId = $values['invoiceId'] ?? null;
        $this->status = $values['status'] ?? null;
        $this->page = $values['page'] ?? null;
        $this->limit = $values['limit'] ?? null;
    }
}
