<?php

namespace NovaBilling\Types;

enum WalletTransactionResponseTransactionStatus: string
{
    case Purchased = "PURCHASED";
    case Granted = "GRANTED";
    case Voided = "VOIDED";
    case Invoiced = "INVOICED";
}
