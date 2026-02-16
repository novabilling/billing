<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class CustomerResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $externalId
     */
    #[JsonProperty('externalId')]
    public string $externalId;

    /**
     * @var string $email
     */
    #[JsonProperty('email')]
    public string $email;

    /**
     * @var ?string $name
     */
    #[JsonProperty('name')]
    public ?string $name;

    /**
     * @var ?string $country
     */
    #[JsonProperty('country')]
    public ?string $country;

    /**
     * @var string $currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var ?array<string, mixed> $metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

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
     *   externalId: string,
     *   email: string,
     *   currency: string,
     *   createdAt: string,
     *   updatedAt: string,
     *   name?: ?string,
     *   country?: ?string,
     *   metadata?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->externalId = $values['externalId'];
        $this->email = $values['email'];
        $this->name = $values['name'] ?? null;
        $this->country = $values['country'] ?? null;
        $this->currency = $values['currency'];
        $this->metadata = $values['metadata'] ?? null;
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
