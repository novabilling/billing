<?php

namespace NovaBilling\Plans\Types;

enum UpdatePlanDtoBillingTiming: string
{
    case InAdvance = "IN_ADVANCE";
    case InArrears = "IN_ARREARS";
}
