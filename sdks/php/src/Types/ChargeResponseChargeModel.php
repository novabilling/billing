<?php

namespace NovaBilling\Types;

enum ChargeResponseChargeModel: string
{
    case Standard = "STANDARD";
    case Graduated = "GRADUATED";
    case Volume = "VOLUME";
    case Package = "PACKAGE";
    case Percentage = "PERCENTAGE";
}
