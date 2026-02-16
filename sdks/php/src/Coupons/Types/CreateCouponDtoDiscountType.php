<?php

namespace NovaBilling\Coupons\Types;

enum CreateCouponDtoDiscountType: string
{
    case Percentage = "PERCENTAGE";
    case FixedAmount = "FIXED_AMOUNT";
}
