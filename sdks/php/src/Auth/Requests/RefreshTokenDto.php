<?php

namespace NovaBilling\Auth\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class RefreshTokenDto extends JsonSerializableType
{
    /**
     * @var string $refreshToken Refresh token
     */
    #[JsonProperty('refreshToken')]
    public string $refreshToken;

    /**
     * @param array{
     *   refreshToken: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->refreshToken = $values['refreshToken'];
    }
}
