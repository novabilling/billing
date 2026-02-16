<?php

namespace NovaBilling\Charges\Types;

enum CreateChargeDtoChargeModel: string
{
    case Standard = "STANDARD";
    case Graduated = "GRADUATED";
    case Volume = "VOLUME";
    case Package = "PACKAGE";
    case Percentage = "PERCENTAGE";
}
