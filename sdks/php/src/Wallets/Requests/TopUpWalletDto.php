<?php

namespace NovaBilling\Wallets\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class TopUpWalletDto extends JsonSerializableType
{
    /**
     * @var string $walletId
     */
    #[JsonProperty('walletId')]
    public string $walletId;

    /**
     * @var ?float $paidCredits Paid credits to purchase
     */
    #[JsonProperty('paidCredits')]
    public ?float $paidCredits;

    /**
     * @var ?float $grantedCredits Free credits to grant
     */
    #[JsonProperty('grantedCredits')]
    public ?float $grantedCredits;

    /**
     * @var ?float $voidedCredits Credits to void
     */
    #[JsonProperty('voidedCredits')]
    public ?float $voidedCredits;

    /**
     * @var ?array<string, mixed> $metadata
     */
    #[JsonProperty('metadata'), ArrayType(['string' => 'mixed'])]
    public ?array $metadata;

    /**
     * @param array{
     *   walletId: string,
     *   paidCredits?: ?float,
     *   grantedCredits?: ?float,
     *   voidedCredits?: ?float,
     *   metadata?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->walletId = $values['walletId'];
        $this->paidCredits = $values['paidCredits'] ?? null;
        $this->grantedCredits = $values['grantedCredits'] ?? null;
        $this->voidedCredits = $values['voidedCredits'] ?? null;
        $this->metadata = $values['metadata'] ?? null;
    }
}
