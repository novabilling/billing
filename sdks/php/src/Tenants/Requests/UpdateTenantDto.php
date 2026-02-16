<?php

namespace NovaBilling\Tenants\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class UpdateTenantDto extends JsonSerializableType
{
    /**
     * @var ?string $name
     */
    #[JsonProperty('name')]
    public ?string $name;

    /**
     * @var ?string $email
     */
    #[JsonProperty('email')]
    public ?string $email;

    /**
     * @var ?string $webhookUrl
     */
    #[JsonProperty('webhookUrl')]
    public ?string $webhookUrl;

    /**
     * @var ?array<string, mixed> $settings Custom tenant settings (merged with existing)
     */
    #[JsonProperty('settings'), ArrayType(['string' => 'mixed'])]
    public ?array $settings;

    /**
     * @param array{
     *   name?: ?string,
     *   email?: ?string,
     *   webhookUrl?: ?string,
     *   settings?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->name = $values['name'] ?? null;
        $this->email = $values['email'] ?? null;
        $this->webhookUrl = $values['webhookUrl'] ?? null;
        $this->settings = $values['settings'] ?? null;
    }
}
