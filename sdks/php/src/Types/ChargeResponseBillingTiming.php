<?php

namespace NovaBilling\Types;

enum ChargeResponseBillingTiming: string
{
    case InAdvance = "IN_ADVANCE";
    case InArrears = "IN_ARREARS";
}
