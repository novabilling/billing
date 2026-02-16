<?php

namespace NovaBilling\BillableMetrics\Types;

enum CreateBillableMetricDtoAggregationType: string
{
    case Count = "COUNT";
    case Sum = "SUM";
    case Max = "MAX";
    case UniqueCount = "UNIQUE_COUNT";
    case Latest = "LATEST";
    case WeightedSum = "WEIGHTED_SUM";
}
