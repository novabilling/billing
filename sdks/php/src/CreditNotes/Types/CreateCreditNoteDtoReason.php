<?php

namespace NovaBilling\CreditNotes\Types;

enum CreateCreditNoteDtoReason: string
{
    case Duplicate = "DUPLICATE";
    case ProductUnsatisfactory = "PRODUCT_UNSATISFACTORY";
    case OrderChange = "ORDER_CHANGE";
    case Other = "OTHER";
}
