<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class TokenPairResponse extends JsonSerializableType
{
    /**
     * @var string $accessToken
     */
    #[JsonProperty('accessToken')]
    public string $accessToken;

    /**
     * @var string $refreshToken
     */
    #[JsonProperty('refreshToken')]
    public string $refreshToken;

    /**
     * @param array{
     *   accessToken: string,
     *   refreshToken: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->accessToken = $values['accessToken'];
        $this->refreshToken = $values['refreshToken'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
