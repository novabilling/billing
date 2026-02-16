<?php

namespace NovaBilling\Analytics\Types;

enum GetCustomersAnalyticsRequestGroupBy: string
{
    case Day = "day";
    case Week = "week";
    case Month = "month";
}
