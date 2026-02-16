<?php

namespace NovaBilling\Auth\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class ForgotPasswordDto extends JsonSerializableType
{
    /**
     * @var string $email
     */
    #[JsonProperty('email')]
    public string $email;

    /**
     * @param array{
     *   email: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->email = $values['email'];
    }
}
