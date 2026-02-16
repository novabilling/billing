<?php

namespace NovaBilling\Taxes\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Types\AssignTaxDto;

class AssignToPlanTaxesRequest extends JsonSerializableType
{
    /**
     * @var AssignTaxDto $body
     */
    public AssignTaxDto $body;

    /**
     * @param array{
     *   body: AssignTaxDto,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->body = $values['body'];
    }
}
