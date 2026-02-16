<?php

namespace NovaBilling\Customers\Types;

enum ListCustomersRequestSortOrder: string
{
    case Asc = "asc";
    case Desc = "desc";
}
