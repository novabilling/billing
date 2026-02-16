<?php

namespace NovaBilling\Events\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Types\CreateEventDto;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class BatchEventsDto extends JsonSerializableType
{
    /**
     * @var array<CreateEventDto> $events Array of events to ingest (max 100)
     */
    #[JsonProperty('events'), ArrayType([CreateEventDto::class])]
    public array $events;

    /**
     * @param array{
     *   events: array<CreateEventDto>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->events = $values['events'];
    }
}
