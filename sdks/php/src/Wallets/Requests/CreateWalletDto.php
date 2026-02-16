<?php

namespace NovaBilling\Wallets\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class CreateWalletDto extends JsonSerializableType
{
    /**
     * @var string $customerId
     */
    #[JsonProperty('customerId')]
    public string $customerId;

    /**
     * @var ?string $name
     */
    #[JsonProperty('name')]
    public ?string $name;

    /**
     * @var string $currency
     */
    #[JsonProperty('currency')]
    public string $currency;

    /**
     * @var ?float $rateAmount 1 credit = rateAmount in currency
     */
    #[JsonProperty('rateAmount')]
    public ?float $rateAmount;

    /**
     * @var ?float $paidCredits Paid credits (purchase)
     */
    #[JsonProperty('paidCredits')]
    public ?float $paidCredits;

    /**
     * @var ?float $grantedCredits Free credits (grant)
     */
    #[JsonProperty('grantedCredits')]
    public ?float $grantedCredits;

    /**
     * @var ?string $expirationAt Expiration date (ISO 8601)
     */
    #[JsonProperty('expirationAt')]
    public ?string $expirationAt;

    /**
     * @var ?array<string, mixed> $metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @var ?string $createdAt Backdate createdAt (ISO 8601). For data imports.
     */
    #[JsonProperty('createdAt')]
    public ?string $createdAt;

    /**
     * @param array{
     *   customerId: string,
     *   currency: string,
     *   name?: ?string,
     *   rateAmount?: ?float,
     *   paidCredits?: ?float,
     *   grantedCredits?: ?float,
     *   expirationAt?: ?string,
     *   metadata?: ?array<string, mixed>,
     *   createdAt?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->customerId = $values['customerId'];
        $this->name = $values['name'] ?? null;
        $this->currency = $values['currency'];
        $this->rateAmount = $values['rateAmount'] ?? null;
        $this->paidCredits = $values['paidCredits'] ?? null;
        $this->grantedCredits = $values['grantedCredits'] ?? null;
        $this->expirationAt = $values['expirationAt'] ?? null;
        $this->metadata = $values['metadata'] ?? null;
        $this->createdAt = $values['createdAt'] ?? null;
    }
}
