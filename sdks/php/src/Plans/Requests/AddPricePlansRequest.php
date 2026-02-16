<?php

namespace NovaBilling\Plans\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Types\CreatePlanPriceDto;

class AddPricePlansRequest extends JsonSerializableType
{
    /**
     * @var CreatePlanPriceDto $body
     */
    public CreatePlanPriceDto $body;

    /**
     * @param array{
     *   body: CreatePlanPriceDto,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->body = $values['body'];
    }
}
