<?php

namespace NovaBilling\ApiKeys\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class CreateApiKeyBodyDto extends JsonSerializableType
{
    /**
     * @var string $name
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var array<string> $scopes
     */
    #[JsonProperty('scopes'), ArrayType(['string'])]
    public array $scopes;

    /**
     * @var ?string $expiresAt
     */
    #[JsonProperty('expiresAt')]
    public ?string $expiresAt;

    /**
     * @param array{
     *   name: string,
     *   scopes: array<string>,
     *   expiresAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->name = $values['name'];
        $this->scopes = $values['scopes'];
        $this->expiresAt = $values['expiresAt'] ?? null;
    }
}
