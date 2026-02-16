<?php

namespace NovaBilling\Auth\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class RegisterDto extends JsonSerializableType
{
    /**
     * @var string $name Full name of the tenant owner
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var string $email Email address
     */
    #[JsonProperty('email')]
    public string $email;

    /**
     * @var string $password Password (min 8 characters)
     */
    #[JsonProperty('password')]
    public string $password;

    /**
     * @var string $companyName Company name (used to generate slug)
     */
    #[JsonProperty('companyName')]
    public string $companyName;

    /**
     * @param array{
     *   name: string,
     *   email: string,
     *   password: string,
     *   companyName: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->name = $values['name'];
        $this->email = $values['email'];
        $this->password = $values['password'];
        $this->companyName = $values['companyName'];
    }
}
