<?php

namespace NovaBilling\Wallets\Types;

enum GetTransactionsWalletsRequestTransactionStatus: string
{
    case Purchased = "PURCHASED";
    case Granted = "GRANTED";
    case Voided = "VOIDED";
    case Invoiced = "INVOICED";
}
