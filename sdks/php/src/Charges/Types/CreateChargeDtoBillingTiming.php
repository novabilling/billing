<?php

namespace NovaBilling\Charges\Types;

enum CreateChargeDtoBillingTiming: string
{
    case InAdvance = "IN_ADVANCE";
    case InArrears = "IN_ARREARS";
}
