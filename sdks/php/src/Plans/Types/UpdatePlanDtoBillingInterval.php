<?php

namespace NovaBilling\Plans\Types;

enum UpdatePlanDtoBillingInterval: string
{
    case Hourly = "HOURLY";
    case Daily = "DAILY";
    case Weekly = "WEEKLY";
    case Monthly = "MONTHLY";
    case Quarterly = "QUARTERLY";
    case Yearly = "YEARLY";
}
