<?php

namespace NovaBilling\Types;

enum CouponResponseDiscountType: string
{
    case Percentage = "PERCENTAGE";
    case FixedAmount = "FIXED_AMOUNT";
}
