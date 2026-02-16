<?php

namespace NovaBilling\Invoices\Types;

enum CreateInvoiceDtoStatus: string
{
    case Draft = "DRAFT";
    case Pending = "PENDING";
    case Paid = "PAID";
    case Failed = "FAILED";
    case Canceled = "CANCELED";
}
