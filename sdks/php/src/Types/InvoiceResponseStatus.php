<?php

namespace NovaBilling\Types;

enum InvoiceResponseStatus: string
{
    case Draft = "DRAFT";
    case Pending = "PENDING";
    case Paid = "PAID";
    case Failed = "FAILED";
    case Canceled = "CANCELED";
}
