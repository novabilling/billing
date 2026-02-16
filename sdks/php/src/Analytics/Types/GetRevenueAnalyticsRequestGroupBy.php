<?php

namespace NovaBilling\Analytics\Types;

enum GetRevenueAnalyticsRequestGroupBy: string
{
    case Day = "day";
    case Week = "week";
    case Month = "month";
}
