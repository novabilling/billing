<?php

namespace NovaBilling\Analytics\Types;

enum GetPaymentsAnalyticsRequestGroupBy: string
{
    case Day = "day";
    case Week = "week";
    case Month = "month";
}
