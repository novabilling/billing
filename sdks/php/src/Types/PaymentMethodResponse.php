<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use DateTime;
use NovaBilling\Core\Types\Date;

class PaymentMethodResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $customerId
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var string $provider
     */
    #[JsonProperty('provider')]
    public string $provider;

    /**
     * @var string $type
     */
    #[JsonProperty('type')]
    public string $type;

    /**
     * @var string $tokenId
     */
    #[JsonProperty('tokenId')]
    public string $tokenId;

    /**
     * @var bool $isDefault
     */
    #[JsonProperty('isDefault')]
    public bool $isDefault;

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
     * @var DateTime $createdAt
     */
    #[JsonProperty('createdAt'), Date(Date::TYPE_DATETIME)]
    public DateTime $createdAt;

    /**
     * @var DateTime $updatedAt
     */
    #[JsonProperty('updatedAt'), Date(Date::TYPE_DATETIME)]
    public DateTime $updatedAt;

    /**
     * @param array{
     *   id: string,
     *   customerId: string,
     *   provider: string,
     *   type: string,
     *   tokenId: string,
     *   isDefault: bool,
     *   createdAt: DateTime,
     *   updatedAt: DateTime,
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
        $this->id = $values['id'];
        $this->customerId = $values['customerId'];
        $this->provider = $values['provider'];
        $this->type = $values['type'];
        $this->tokenId = $values['tokenId'];
        $this->isDefault = $values['isDefault'];
        $this->last4 = $values['last4'] ?? null;
        $this->brand = $values['brand'] ?? null;
        $this->expMonth = $values['expMonth'] ?? null;
        $this->expYear = $values['expYear'] ?? null;
        $this->cardholderName = $values['cardholderName'] ?? null;
        $this->country = $values['country'] ?? null;
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
