<?php

namespace NovaBilling\Wallets\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class UpdateWalletDto extends JsonSerializableType
{
    /**
     * @var ?string $name
     */
    #[JsonProperty('name')]
    public ?string $name;

    /**
     * @var ?string $expirationAt
     */
    #[JsonProperty('expirationAt')]
    public ?string $expirationAt;

    /**
     * @var ?array<string, mixed> $metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @param array{
     *   name?: ?string,
     *   expirationAt?: ?string,
     *   metadata?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->name = $values['name'] ?? null;
        $this->expirationAt = $values['expirationAt'] ?? null;
        $this->metadata = $values['metadata'] ?? null;
    }
}
