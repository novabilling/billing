<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class AppliedAddOnResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $addOnId
     */
    #[JsonProperty('addOnId')]
    public string $addOnId;

    /**
     * @var string $customerId
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var ?string $subscriptionId
     */
    #[JsonProperty('subscriptionId')]
    public ?string $subscriptionId;

    /**
     * @var string $amount
     */
    #[JsonProperty('amount')]
    public string $amount;

    /**
     * @var string $currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var ?string $invoiceId
     */
    #[JsonProperty('invoiceId')]
    public ?string $invoiceId;

    /**
     * @var string $createdAt
     */
    #[JsonProperty('createdAt')]
    public string $createdAt;

    /**
     * @param array{
     *   id: string,
     *   addOnId: string,
     *   customerId: string,
     *   amount: string,
     *   currency: string,
     *   createdAt: string,
     *   subscriptionId?: ?string,
     *   invoiceId?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->addOnId = $values['addOnId'];
        $this->customerId = $values['customerId'];
        $this->subscriptionId = $values['subscriptionId'] ?? null;
        $this->amount = $values['amount'];
        $this->currency = $values['currency'];
        $this->invoiceId = $values['invoiceId'] ?? null;
        $this->createdAt = $values['createdAt'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
