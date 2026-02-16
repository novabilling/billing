<?php

namespace NovaBilling\AddOns\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Types\AddOnPriceDto;
use NovaBilling\Core\Types\ArrayType;

class CreateAddOnDto extends JsonSerializableType
{
    /**
     * @var string $name Display name
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var string $code Unique code for the add-on
     */
    #[JsonProperty('code')]
    public string $code;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var ?string $invoiceDisplayName Custom name shown on invoices
     */
    #[JsonProperty('invoiceDisplayName')]
    public ?string $invoiceDisplayName;

    /**
     * @var array<AddOnPriceDto> $prices Prices in different currencies
     */
    #[JsonProperty('prices'), ArrayType([AddOnPriceDto::class])]
    public array $prices;

    /**
     * @var ?string $createdAt Backdate createdAt (ISO 8601). For data imports.
     */
    #[JsonProperty('createdAt')]
    public ?string $createdAt;

    /**
     * @param array{
     *   name: string,
     *   code: string,
     *   prices: array<AddOnPriceDto>,
     *   description?: ?string,
     *   invoiceDisplayName?: ?string,
     *   createdAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->name = $values['name'];
        $this->code = $values['code'];
        $this->description = $values['description'] ?? null;
        $this->invoiceDisplayName = $values['invoiceDisplayName'] ?? null;
        $this->prices = $values['prices'];
        $this->createdAt = $values['createdAt'] ?? null;
    }
}
