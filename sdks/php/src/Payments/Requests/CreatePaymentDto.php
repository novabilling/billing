<?php

namespace NovaBilling\Payments\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Payments\Types\CreatePaymentDtoStatus;

class CreatePaymentDto extends JsonSerializableType
{
    /**
     * @var string $invoiceId Invoice ID this payment is for
     */
    #[JsonProperty('invoiceId')]
    public string $invoiceId;

    /**
     * @var string $provider Payment provider name (e.g. stripe, paystack, manual)
     */
    #[JsonProperty('provider')]
    public string $provider;

    /**
     * @var float $amount Payment amount
     */
    #[JsonProperty('amount')]
    public float $amount;

    /**
     * @var string $currency Currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var value-of<CreatePaymentDtoStatus> $status Payment status
     */
    #[JsonProperty('status')]
    public string $status;

    /**
     * @var ?string $providerTransactionId Provider transaction ID
     */
    #[JsonProperty('providerTransactionId')]
    public ?string $providerTransactionId;

    /**
     * @var ?string $failureReason Failure reason (for FAILED payments)
     */
    #[JsonProperty('failureReason')]
    public ?string $failureReason;

    /**
     * @var ?string $createdAt Backdate createdAt (ISO 8601). For data imports.
     */
    #[JsonProperty('createdAt')]
    public ?string $createdAt;

    /**
     * @param array{
     *   invoiceId: string,
     *   provider: string,
     *   amount: float,
     *   currency: string,
     *   status: value-of<CreatePaymentDtoStatus>,
     *   providerTransactionId?: ?string,
     *   failureReason?: ?string,
     *   createdAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->invoiceId = $values['invoiceId'];
        $this->provider = $values['provider'];
        $this->amount = $values['amount'];
        $this->currency = $values['currency'];
        $this->status = $values['status'];
        $this->providerTransactionId = $values['providerTransactionId'] ?? null;
        $this->failureReason = $values['failureReason'] ?? null;
        $this->createdAt = $values['createdAt'] ?? null;
    }
}
