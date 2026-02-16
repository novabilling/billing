<?php

namespace NovaBilling\Customers\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class CreateCustomerDto extends JsonSerializableType
{
    /**
     * @var string $externalId Tenant's user ID
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
     * @var string $currency ISO currency code
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var ?array<string, mixed> $metadata Custom metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @var ?float $netPaymentTerms Net payment terms in days (overrides org and plan defaults)
     */
    #[JsonProperty('netPaymentTerms')]
    public ?float $netPaymentTerms;

    /**
     * @var ?string $createdAt Backdate createdAt (ISO 8601). For data imports.
     */
    #[JsonProperty('createdAt')]
    public ?string $createdAt;

    /**
     * @param array{
     *   externalId: string,
     *   email: string,
     *   currency: string,
     *   name?: ?string,
     *   country?: ?string,
     *   metadata?: ?array<string, mixed>,
     *   netPaymentTerms?: ?float,
     *   createdAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->externalId = $values['externalId'];
        $this->email = $values['email'];
        $this->name = $values['name'] ?? null;
        $this->country = $values['country'] ?? null;
        $this->currency = $values['currency'];
        $this->metadata = $values['metadata'] ?? null;
        $this->netPaymentTerms = $values['netPaymentTerms'] ?? null;
        $this->createdAt = $values['createdAt'] ?? null;
    }
}
