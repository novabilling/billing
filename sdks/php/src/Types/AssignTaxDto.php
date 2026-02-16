<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class AssignTaxDto extends JsonSerializableType
{
    /**
     * @var string $taxId Tax ID to assign
     */
    #[JsonProperty('taxId')]
    public string $taxId;

    /**
     * @param array{
     *   taxId: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->taxId = $values['taxId'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
