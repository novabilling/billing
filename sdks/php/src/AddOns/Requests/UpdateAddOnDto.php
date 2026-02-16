<?php

namespace NovaBilling\AddOns\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Types\AddOnPriceDto;
use NovaBilling\Core\Types\ArrayType;

class UpdateAddOnDto extends JsonSerializableType
{
    /**
     * @var ?string $name
     */
    #[JsonProperty('name')]
    public ?string $name;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var ?string $invoiceDisplayName
     */
    #[JsonProperty('invoiceDisplayName')]
    public ?string $invoiceDisplayName;

    /**
     * @var ?array<AddOnPriceDto> $prices
     */
    #[JsonProperty('prices'), ArrayType([AddOnPriceDto::class])]
    public ?array $prices;

    /**
     * @param array{
     *   name?: ?string,
     *   description?: ?string,
     *   invoiceDisplayName?: ?string,
     *   prices?: ?array<AddOnPriceDto>,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->name = $values['name'] ?? null;
        $this->description = $values['description'] ?? null;
        $this->invoiceDisplayName = $values['invoiceDisplayName'] ?? null;
        $this->prices = $values['prices'] ?? null;
    }
}
