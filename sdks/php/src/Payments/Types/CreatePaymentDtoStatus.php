<?php

namespace NovaBilling\Payments\Types;

enum CreatePaymentDtoStatus: string
{
    case Processing = "PROCESSING";
    case Succeeded = "SUCCEEDED";
    case Failed = "FAILED";
    case Refunded = "REFUNDED";
}
