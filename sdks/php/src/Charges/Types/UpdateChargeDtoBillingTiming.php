<?php

namespace NovaBilling\Charges\Types;

enum UpdateChargeDtoBillingTiming: string
{
    case InAdvance = "IN_ADVANCE";
    case InArrears = "IN_ARREARS";
}
