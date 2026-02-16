<?php

namespace NovaBilling\Types;

enum CreditNoteResponseReason: string
{
    case Duplicate = "DUPLICATE";
    case ProductUnsatisfactory = "PRODUCT_UNSATISFACTORY";
    case OrderChange = "ORDER_CHANGE";
    case Other = "OTHER";
}
