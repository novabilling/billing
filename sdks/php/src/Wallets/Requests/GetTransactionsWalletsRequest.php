<?php

namespace NovaBilling\Wallets\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Wallets\Types\GetTransactionsWalletsRequestStatus;
use NovaBilling\Wallets\Types\GetTransactionsWalletsRequestTransactionStatus;
use NovaBilling\Wallets\Types\GetTransactionsWalletsRequestTransactionType;

class GetTransactionsWalletsRequest extends JsonSerializableType
{
    /**
     * @var ?value-of<GetTransactionsWalletsRequestStatus> $status
     */
    public ?string $status;

    /**
     * @var ?value-of<GetTransactionsWalletsRequestTransactionStatus> $transactionStatus
     */
    public ?string $transactionStatus;

    /**
     * @var ?value-of<GetTransactionsWalletsRequestTransactionType> $transactionType
     */
    public ?string $transactionType;

    /**
     * @var ?float $page
     */
    public ?float $page;

    /**
     * @var ?float $limit
     */
    public ?float $limit;

    /**
     * @param array{
     *   status?: ?value-of<GetTransactionsWalletsRequestStatus>,
     *   transactionStatus?: ?value-of<GetTransactionsWalletsRequestTransactionStatus>,
     *   transactionType?: ?value-of<GetTransactionsWalletsRequestTransactionType>,
     *   page?: ?float,
     *   limit?: ?float,
     * } $values
     */
    public function __construct(
        array $values = [],
    ) {
        $this->status = $values['status'] ?? null;
        $this->transactionStatus = $values['transactionStatus'] ?? null;
        $this->transactionType = $values['transactionType'] ?? null;
        $this->page = $values['page'] ?? null;
        $this->limit = $values['limit'] ?? null;
    }
}
