<?php

namespace NovaBilling\Plans\Requests;

use NovaBilling\Core\Json\JsonSerializableType;

class ListPlansRequest extends JsonSerializableType
{
    /**
     * @var ?bool $isActive Filter by active status
     */
    public ?bool $isActive;

    /**
     * @param array{
     *   isActive?: ?bool,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->isActive = $values['isActive'] ?? null;
    }
}
