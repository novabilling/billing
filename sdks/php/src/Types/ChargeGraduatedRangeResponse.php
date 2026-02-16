<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class ChargeGraduatedRangeResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $chargeId
     */
    #[JsonProperty('chargeId')]
    public string $chargeId;

    /**
     * @var float $fromValue
     */
    #[JsonProperty('fromValue')]
    public float $fromValue;

    /**
     * @var ?float $toValue
     */
    #[JsonProperty('toValue')]
    public ?float $toValue;

    /**
     * @var string $perUnitAmount Per-unit amount as decimal string
     */
    #[JsonProperty('perUnitAmount')]
    public string $perUnitAmount;

    /**
     * @var string $flatAmount Flat fee for this range
     */
    #[JsonProperty('flatAmount')]
    public string $flatAmount;

    /**
     * @var float $order
     */
    #[JsonProperty('order')]
    public float $order;

    /**
     * @param array{
     *   id: string,
     *   chargeId: string,
     *   fromValue: float,
     *   perUnitAmount: string,
     *   flatAmount: string,
     *   order: float,
     *   toValue?: ?float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->chargeId = $values['chargeId'];
        $this->fromValue = $values['fromValue'];
        $this->toValue = $values['toValue'] ?? null;
        $this->perUnitAmount = $values['perUnitAmount'];
        $this->flatAmount = $values['flatAmount'];
        $this->order = $values['order'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
