<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class TenantInfoResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $name
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var string $slug
     */
    #[JsonProperty('slug')]
    public string $slug;

    /**
     * @var string $email
     */
    #[JsonProperty('email')]
    public string $email;

    /**
     * @var string $apiKey
     */
    #[JsonProperty('apiKey')]
    public string $apiKey;

    /**
     * @var ?string $webhookUrl
     */
    #[JsonProperty('webhookUrl')]
    public ?string $webhookUrl;

    /**
     * @var ?string $webhookSecret
     */
    #[JsonProperty('webhookSecret')]
    public ?string $webhookSecret;

    /**
     * @var bool $isActive
     */
    #[JsonProperty('isActive')]
    public bool $isActive;

    /**
     * @var ?array<string, mixed> $settings
     */
    #[JsonProperty('settings'), ArrayType(['string' => 'mixed'])]
    public ?array $settings;

    /**
     * @var ?string $lastLoginAt
     */
    #[JsonProperty('lastLoginAt')]
    public ?string $lastLoginAt;

    /**
     * @var string $createdAt
     */
    #[JsonProperty('createdAt')]
    public string $createdAt;

    /**
     * @var string $updatedAt
     */
    #[JsonProperty('updatedAt')]
    public string $updatedAt;

    /**
     * @param array{
     *   id: string,
     *   name: string,
     *   slug: string,
     *   email: string,
     *   apiKey: string,
     *   isActive: bool,
     *   createdAt: string,
     *   updatedAt: string,
     *   webhookUrl?: ?string,
     *   webhookSecret?: ?string,
     *   settings?: ?array<string, mixed>,
     *   lastLoginAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->name = $values['name'];
        $this->slug = $values['slug'];
        $this->email = $values['email'];
        $this->apiKey = $values['apiKey'];
        $this->webhookUrl = $values['webhookUrl'] ?? null;
        $this->webhookSecret = $values['webhookSecret'] ?? null;
        $this->isActive = $values['isActive'];
        $this->settings = $values['settings'] ?? null;
        $this->lastLoginAt = $values['lastLoginAt'] ?? null;
        $this->createdAt = $values['createdAt'];
        $this->updatedAt = $values['updatedAt'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
