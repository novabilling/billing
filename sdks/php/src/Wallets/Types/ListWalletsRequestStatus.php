<?php

namespace NovaBilling\Wallets\Types;

enum ListWalletsRequestStatus: string
{
    case Active = "ACTIVE";
    case Terminated = "TERMINATED";
}
