<?php

namespace NovaBilling\PaymentMethods\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\PaymentMethods\Types\CreatePaymentMethodDtoType;

class CreatePaymentMethodDto extends JsonSerializableType
{
    /**
     * @var string $customerId
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var string $provider Payment provider (stripe, paystack, flutterwave, dpo, payu, pesapal)
     */
    #[JsonProperty('provider')]
    public string $provider;

    /**
     * @var ?value-of<CreatePaymentMethodDtoType> $type
     */
    #[JsonProperty('type')]
    public ?string $type;

    /**
     * @var string $tokenId Provider-specific token/payment method ID
     */
    #[JsonProperty('tokenId')]
    public string $tokenId;

    /**
     * @var ?string $last4
     */
    #[JsonProperty('last4')]
    public ?string $last4;

    /**
     * @var ?string $brand
     */
    #[JsonProperty('brand')]
    public ?string $brand;

    /**
     * @var ?float $expMonth
     */
    #[JsonProperty('expMonth')]
    public ?float $expMonth;

    /**
     * @var ?float $expYear
     */
    #[JsonProperty('expYear')]
    public ?float $expYear;

    /**
     * @var ?string $cardholderName
     */
    #[JsonProperty('cardholderName')]
    public ?string $cardholderName;

    /**
     * @var ?string $country
     */
    #[JsonProperty('country')]
    public ?string $country;

    /**
     * @param array{
     *   customerId: string,
     *   provider: string,
     *   tokenId: string,
     *   type?: ?value-of<CreatePaymentMethodDtoType>,
     *   last4?: ?string,
     *   brand?: ?string,
     *   expMonth?: ?float,
     *   expYear?: ?float,
     *   cardholderName?: ?string,
     *   country?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->customerId = $values['customerId'];
        $this->provider = $values['provider'];
        $this->type = $values['type'] ?? null;
        $this->tokenId = $values['tokenId'];
        $this->last4 = $values['last4'] ?? null;
        $this->brand = $values['brand'] ?? null;
        $this->expMonth = $values['expMonth'] ?? null;
        $this->expYear = $values['expYear'] ?? null;
        $this->cardholderName = $values['cardholderName'] ?? null;
        $this->country = $values['country'] ?? null;
    }
}
