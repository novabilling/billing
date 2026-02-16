<?php

namespace NovaBilling\Taxes\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class CreateTaxDto extends JsonSerializableType
{
    /**
     * @var string $name Tax name
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var string $code Unique tax code (lowercase, underscores)
     */
    #[JsonProperty('code')]
    public string $code;

    /**
     * @var float $rate Tax rate as a percentage (e.g., 18 for 18%)
     */
    #[JsonProperty('rate')]
    public float $rate;

    /**
     * @var ?string $description Tax description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var ?bool $appliedByDefault Whether this tax is applied by default to all invoices
     */
    #[JsonProperty('appliedByDefault')]
    public ?bool $appliedByDefault;

    /**
     * @param array{
     *   name: string,
     *   code: string,
     *   rate: float,
     *   description?: ?string,
     *   appliedByDefault?: ?bool,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->name = $values['name'];
        $this->code = $values['code'];
        $this->rate = $values['rate'];
        $this->description = $values['description'] ?? null;
        $this->appliedByDefault = $values['appliedByDefault'] ?? null;
    }
}
