<?php

namespace NovaBilling\Invoices\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Types\InvoiceItemDto;
use NovaBilling\Core\Types\ArrayType;
use NovaBilling\Invoices\Types\CreateInvoiceDtoStatus;

class CreateInvoiceDto extends JsonSerializableType
{
    /**
     * @var string $customerId Customer ID
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var ?string $subscriptionId Subscription ID (optional)
     */
    #[JsonProperty('subscriptionId')]
    public ?string $subscriptionId;

    /**
     * @var array<InvoiceItemDto> $items
     */
    #[JsonProperty('items'), ArrayType([InvoiceItemDto::class])]
    public array $items;

    /**
     * @var string $dueDate Due date
     */
    #[JsonProperty('dueDate')]
    public string $dueDate;

    /**
     * @var ?value-of<CreateInvoiceDtoStatus> $status Override invoice status for imports
     */
    #[JsonProperty('status')]
    public ?string $status;

    /**
     * @var ?string $invoiceNumber Override invoice number (e.g. INV-00042). Auto-generated if omitted.
     */
    #[JsonProperty('invoiceNumber')]
    public ?string $invoiceNumber;

    /**
     * @var ?string $currency Currency override (defaults to customer currency)
     */
    #[JsonProperty('currency')]
    public ?string $currency;

    /**
     * @var ?string $paidAt Paid at date (ISO 8601). For importing paid invoices.
     */
    #[JsonProperty('paidAt')]
    public ?string $paidAt;

    /**
     * @var ?string $createdAt Backdate createdAt (ISO 8601). For data imports.
     */
    #[JsonProperty('createdAt')]
    public ?string $createdAt;

    /**
     * @param array{
     *   customerId: string,
     *   items: array<InvoiceItemDto>,
     *   dueDate: string,
     *   subscriptionId?: ?string,
     *   status?: ?value-of<CreateInvoiceDtoStatus>,
     *   invoiceNumber?: ?string,
     *   currency?: ?string,
     *   paidAt?: ?string,
     *   createdAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->customerId = $values['customerId'];
        $this->subscriptionId = $values['subscriptionId'] ?? null;
        $this->items = $values['items'];
        $this->dueDate = $values['dueDate'];
        $this->status = $values['status'] ?? null;
        $this->invoiceNumber = $values['invoiceNumber'] ?? null;
        $this->currency = $values['currency'] ?? null;
        $this->paidAt = $values['paidAt'] ?? null;
        $this->createdAt = $values['createdAt'] ?? null;
    }
}
