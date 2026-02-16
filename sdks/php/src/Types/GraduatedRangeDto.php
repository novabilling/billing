<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class GraduatedRangeDto extends JsonSerializableType
{
    /**
     * @var float $fromValue Start of range (inclusive)
     */
    #[JsonProperty('fromValue')]
    public float $fromValue;

    /**
     * @var ?float $toValue End of range (inclusive), null = infinity
     */
    #[JsonProperty('toValue')]
    public ?float $toValue;

    /**
     * @var float $perUnitAmount Price per unit in this range
     */
    #[JsonProperty('perUnitAmount')]
    public float $perUnitAmount;

    /**
     * @var ?float $flatAmount Flat fee for entering this range
     */
    #[JsonProperty('flatAmount')]
    public ?float $flatAmount;

    /**
     * @param array{
     *   fromValue: float,
     *   perUnitAmount: float,
     *   toValue?: ?float,
     *   flatAmount?: ?float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->fromValue = $values['fromValue'];
        $this->toValue = $values['toValue'] ?? null;
        $this->perUnitAmount = $values['perUnitAmount'];
        $this->flatAmount = $values['flatAmount'] ?? null;
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
