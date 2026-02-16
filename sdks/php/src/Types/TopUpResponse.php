<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class TopUpResponse extends JsonSerializableType
{
    /**
     * @var array<WalletTransactionResponse> $transactions
     */
    #[JsonProperty('transactions'), ArrayType([WalletTransactionResponse::class])]
    public array $transactions;

    /**
     * @var WalletResponse $wallet
     */
    #[JsonProperty('wallet')]
    public WalletResponse $wallet;

    /**
     * @param array{
     *   transactions: array<WalletTransactionResponse>,
     *   wallet: WalletResponse,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->transactions = $values['transactions'];
        $this->wallet = $values['wallet'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
