<?php

namespace NovaBilling\Auth\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class ResetPasswordDto extends JsonSerializableType
{
    /**
     * @var string $token Password reset token
     */
    #[JsonProperty('token')]
    public string $token;

    /**
     * @var string $newPassword New password (min 8 characters)
     */
    #[JsonProperty('newPassword')]
    public string $newPassword;

    /**
     * @param array{
     *   token: string,
     *   newPassword: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->token = $values['token'];
        $this->newPassword = $values['newPassword'];
    }
}
