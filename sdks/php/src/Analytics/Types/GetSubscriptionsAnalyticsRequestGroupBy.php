<?php

namespace NovaBilling\Analytics\Types;

enum GetSubscriptionsAnalyticsRequestGroupBy: string
{
    case Day = "day";
    case Week = "week";
    case Month = "month";
}
