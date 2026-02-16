<?php

namespace NovaBilling\CreditNotes\Types;

enum CreateCreditNoteDtoStatus: string
{
    case Draft = "DRAFT";
    case Finalized = "FINALIZED";
    case Voided = "VOIDED";
}
