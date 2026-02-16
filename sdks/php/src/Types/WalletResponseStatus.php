<?php

namespace NovaBilling\Types;

enum WalletResponseStatus: string
{
    case Active = "ACTIVE";
    case Terminated = "TERMINATED";
}
