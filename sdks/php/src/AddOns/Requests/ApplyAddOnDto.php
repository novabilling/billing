<?php

namespace NovaBilling\AddOns\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class ApplyAddOnDto extends JsonSerializableType
{
    /**
     * @var string $addOnId Add-on ID
     */
    #[JsonProperty('addOnId')]
    public string $addOnId;

    /**
     * @var string $customerId Customer ID
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var ?string $subscriptionId Subscription to attach the charge to
     */
    #[JsonProperty('subscriptionId')]
    public ?string $subscriptionId;

    /**
     * @var float $amount Charge amount
     */
    #[JsonProperty('amount')]
    public float $amount;

    /**
     * @var string $currency Currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @param array{
     *   addOnId: string,
     *   customerId: string,
     *   amount: float,
     *   currency: string,
     *   subscriptionId?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->addOnId = $values['addOnId'];
        $this->customerId = $values['customerId'];
        $this->subscriptionId = $values['subscriptionId'] ?? null;
        $this->amount = $values['amount'];
        $this->currency = $values['currency'];
    }
}
