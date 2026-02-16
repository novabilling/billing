<?php

namespace NovaBilling\Plans\Types;

enum CreatePlanDtoBillingTiming: string
{
    case InAdvance = "IN_ADVANCE";
    case InArrears = "IN_ARREARS";
}
