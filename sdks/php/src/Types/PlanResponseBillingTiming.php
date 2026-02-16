<?php

namespace NovaBilling\Types;

enum PlanResponseBillingTiming: string
{
    case InAdvance = "IN_ADVANCE";
    case InArrears = "IN_ARREARS";
}
