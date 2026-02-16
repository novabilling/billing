<?php

namespace NovaBilling\Types;

enum PaymentResponseStatus: string
{
    case Pending = "PENDING";
    case Processing = "PROCESSING";
    case Succeeded = "SUCCEEDED";
    case Failed = "FAILED";
    case Refunded = "REFUNDED";
}
