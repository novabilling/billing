<?php

namespace NovaBilling\Tenants\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class TestSmtpTenantsRequest extends JsonSerializableType
{
    /**
     * @var string $to Recipient email address
     */
    #[JsonProperty('to')]
    public string $to;

    /**
     * @param array{
     *   to: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->to = $values['to'];
    }
}
