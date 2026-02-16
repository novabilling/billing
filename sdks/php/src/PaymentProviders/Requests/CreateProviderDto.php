<?php

namespace NovaBilling\PaymentProviders\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class CreateProviderDto extends JsonSerializableType
{
    /**
     * @var string $providerName Provider name
     */
    #[JsonProperty('providerName')]
    public string $providerName;

    /**
     * @var array<string, mixed> $credentials Provider credentials (will be encrypted)
     */
    #[JsonProperty('credentials'), ArrayType(['string' => 'mixed'])]
    public array $credentials;

    /**
     * @var ?bool $isActive
     */
    #[JsonProperty('isActive')]
    public ?bool $isActive;

    /**
     * @var ?float $priority Priority (lower = higher)
     */
    #[JsonProperty('priority')]
    public ?float $priority;

    /**
     * @param array{
     *   providerName: string,
     *   credentials: array<string, mixed>,
     *   isActive?: ?bool,
     *   priority?: ?float,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->providerName = $values['providerName'];
        $this->credentials = $values['credentials'];
        $this->isActive = $values['isActive'] ?? null;
        $this->priority = $values['priority'] ?? null;
    }
}
