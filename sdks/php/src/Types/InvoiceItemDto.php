<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class InvoiceItemDto extends JsonSerializableType
{
    /**
     * @var string $description
     */
    #[JsonProperty('description')]
    public string $description;

    /**
     * @var float $quantity
     */
    #[JsonProperty('quantity')]
    public float $quantity;

    /**
     * @var float $unitAmount
     */
    #[JsonProperty('unitAmount')]
    public float $unitAmount;

    /**
     * @param array{
     *   description: string,
     *   quantity: float,
     *   unitAmount: float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->description = $values['description'];
        $this->quantity = $values['quantity'];
        $this->unitAmount = $values['unitAmount'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
