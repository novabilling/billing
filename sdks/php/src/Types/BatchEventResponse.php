<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class BatchEventResponse extends JsonSerializableType
{
    /**
     * @var float $received
     */
    #[JsonProperty('received')]
    public float $received;

    /**
     * @var float $processed
     */
    #[JsonProperty('processed')]
    public float $processed;

    /**
     * @var float $duplicates
     */
    #[JsonProperty('duplicates')]
    public float $duplicates;

    /**
     * @param array{
     *   received: float,
     *   processed: float,
     *   duplicates: float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->received = $values['received'];
        $this->processed = $values['processed'];
        $this->duplicates = $values['duplicates'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
