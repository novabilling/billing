<?php

namespace NovaBilling\Portal\Types;

enum GetInvoicesPortalRequestStatus: string
{
    case Pending = "PENDING";
    case Paid = "PAID";
    case Failed = "FAILED";
    case Canceled = "CANCELED";
}
