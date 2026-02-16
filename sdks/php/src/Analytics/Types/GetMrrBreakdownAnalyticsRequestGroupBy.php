<?php

namespace NovaBilling\Analytics\Types;

enum GetMrrBreakdownAnalyticsRequestGroupBy: string
{
    case Day = "day";
    case Week = "week";
    case Month = "month";
}
