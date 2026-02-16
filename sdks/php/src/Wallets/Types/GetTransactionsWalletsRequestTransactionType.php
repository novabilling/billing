<?php

namespace NovaBilling\Wallets\Types;

enum GetTransactionsWalletsRequestTransactionType: string
{
    case Inbound = "INBOUND";
    case Outbound = "OUTBOUND";
}
