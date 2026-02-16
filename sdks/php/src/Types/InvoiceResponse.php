<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class InvoiceResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $invoiceNumber
     */
    #[JsonProperty('invoiceNumber')]
    public string $invoiceNumber;

    /**
     * @var ?string $subscriptionId
     */
    #[JsonProperty('subscriptionId')]
    public ?string $subscriptionId;

    /**
     * @var string $customerId
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var string $amount Decimal amount as string
     */
    #[JsonProperty('amount')]
    public string $amount;

    /**
     * @var string $currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var value-of<InvoiceResponseStatus> $status
     */
    #[JsonProperty('status')]
    public string $status;

    /**
     * @var string $dueDate
     */
    #[JsonProperty('dueDate')]
    public string $dueDate;

    /**
     * @var ?string $paidAt
     */
    #[JsonProperty('paidAt')]
    public ?string $paidAt;

    /**
     * @var ?string $pdfUrl
     */
    #[JsonProperty('pdfUrl')]
    public ?string $pdfUrl;

    /**
     * @var ?array<string, mixed> $metadata Line items, plan info, discounts
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @var ?InvoiceCustomerResponse $customer
     */
    #[JsonProperty('customer')]
    public ?InvoiceCustomerResponse $customer;

    /**
     * @var string $createdAt
     */
    #[JsonProperty('createdAt')]
    public string $createdAt;

    /**
     * @var string $updatedAt
     */
    #[JsonProperty('updatedAt')]
    public string $updatedAt;

    /**
     * @param array{
     *   id: string,
     *   invoiceNumber: string,
     *   customerId: string,
     *   amount: string,
     *   currency: string,
     *   status: value-of<InvoiceResponseStatus>,
     *   dueDate: string,
     *   createdAt: string,
     *   updatedAt: string,
     *   subscriptionId?: ?string,
     *   paidAt?: ?string,
     *   pdfUrl?: ?string,
     *   metadata?: ?array<string, mixed>,
     *   customer?: ?InvoiceCustomerResponse,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->invoiceNumber = $values['invoiceNumber'];
        $this->subscriptionId = $values['subscriptionId'] ?? null;
        $this->customerId = $values['customerId'];
        $this->amount = $values['amount'];
        $this->currency = $values['currency'];
        $this->status = $values['status'];
        $this->dueDate = $values['dueDate'];
        $this->paidAt = $values['paidAt'] ?? null;
        $this->pdfUrl = $values['pdfUrl'] ?? null;
        $this->metadata = $values['metadata'] ?? null;
        $this->customer = $values['customer'] ?? null;
        $this->createdAt = $values['createdAt'];
        $this->updatedAt = $values['updatedAt'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
