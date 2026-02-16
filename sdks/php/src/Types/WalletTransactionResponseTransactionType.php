<?php

namespace NovaBilling\Types;

enum WalletTransactionResponseTransactionType: string
{
    case Inbound = "INBOUND";
    case Outbound = "OUTBOUND";
}
