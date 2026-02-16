<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class CreatePlanPriceDto extends JsonSerializableType
{
    /**
     * @var string $currency ISO currency code
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var float $amount Price amount
     */
    #[JsonProperty('amount')]
    public float $amount;

    /**
     * @param array{
     *   currency: string,
     *   amount: float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
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
