<?php

namespace NovaBilling\CreditNotes\Types;

enum ListCreditNotesRequestStatus: string
{
    case Draft = "DRAFT";
    case Finalized = "FINALIZED";
    case Voided = "VOIDED";
}
