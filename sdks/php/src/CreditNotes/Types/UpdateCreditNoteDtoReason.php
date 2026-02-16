<?php

namespace NovaBilling\CreditNotes\Types;

enum UpdateCreditNoteDtoReason: string
{
    case Duplicate = "DUPLICATE";
    case ProductUnsatisfactory = "PRODUCT_UNSATISFACTORY";
    case OrderChange = "ORDER_CHANGE";
    case Other = "OTHER";
}
