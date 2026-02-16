<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class AddOnPriceResponse extends JsonSerializableType
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
     * @var string $currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var string $amount Decimal amount as string
     */
    #[JsonProperty('amount')]
    public string $amount;

    /**
     * @param array{
     *   id: string,
     *   addOnId: string,
     *   currency: string,
     *   amount: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->addOnId = $values['addOnId'];
        $this->currency = $values['currency'];
        $this->amount = $values['amount'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
