<?php

namespace NovaBilling\Types;

enum SubscriptionPlanResponseBillingInterval: string
{
    case Hourly = "HOURLY";
    case Daily = "DAILY";
    case Weekly = "WEEKLY";
    case Monthly = "MONTHLY";
    case Quarterly = "QUARTERLY";
    case Yearly = "YEARLY";
}
