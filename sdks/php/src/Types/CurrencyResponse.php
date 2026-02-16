<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;

class CurrencyResponse extends JsonSerializableType
{
    /**
     * @param array{
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        unset($values);
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
