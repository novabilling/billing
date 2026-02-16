<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class LoginResponse extends JsonSerializableType
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
     * @var TenantInfoResponse $tenant
     */
    #[JsonProperty('tenant')]
    public TenantInfoResponse $tenant;

    /**
     * @param array{
     *   accessToken: string,
     *   refreshToken: string,
     *   tenant: TenantInfoResponse,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->accessToken = $values['accessToken'];
        $this->refreshToken = $values['refreshToken'];
        $this->tenant = $values['tenant'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
