<?php

namespace NovaBilling\Types;

enum SubscriptionResponseBillingTiming: string
{
    case InAdvance = "IN_ADVANCE";
    case InArrears = "IN_ARREARS";
}
