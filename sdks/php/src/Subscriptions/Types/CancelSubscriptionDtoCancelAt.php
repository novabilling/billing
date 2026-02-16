<?php

namespace NovaBilling\Subscriptions\Types;

enum CancelSubscriptionDtoCancelAt: string
{
    case Now = "now";
    case PeriodEnd = "period_end";
}
