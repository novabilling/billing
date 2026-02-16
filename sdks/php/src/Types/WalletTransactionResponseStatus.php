<?php

namespace NovaBilling\Types;

enum WalletTransactionResponseStatus: string
{
    case Pending = "PENDING";
    case Settled = "SETTLED";
    case Failed = "FAILED";
}
