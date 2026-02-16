<?php

namespace NovaBilling\Analytics\Types;

enum GetNetRevenueAnalyticsRequestGroupBy: string
{
    case Day = "day";
    case Week = "week";
    case Month = "month";
}
