<?php

namespace NovaBilling\Taxes\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class UpdateTaxDto extends JsonSerializableType
{
    /**
     * @var ?string $name
     */
    #[JsonProperty('name')]
    public ?string $name;

    /**
     * @var ?float $rate
     */
    #[JsonProperty('rate')]
    public ?float $rate;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var ?bool $appliedByDefault
     */
    #[JsonProperty('appliedByDefault')]
    public ?bool $appliedByDefault;

    /**
     * @param array{
     *   name?: ?string,
     *   rate?: ?float,
     *   description?: ?string,
     *   appliedByDefault?: ?bool,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->name = $values['name'] ?? null;
        $this->rate = $values['rate'] ?? null;
        $this->description = $values['description'] ?? null;
        $this->appliedByDefault = $values['appliedByDefault'] ?? null;
    }
}
