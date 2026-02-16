<?php

namespace NovaBilling\Wallets\Types;

enum GetTransactionsWalletsRequestStatus: string
{
    case Pending = "PENDING";
    case Settled = "SETTLED";
    case Failed = "FAILED";
}
