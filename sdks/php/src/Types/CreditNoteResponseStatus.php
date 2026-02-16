<?php

namespace NovaBilling\Types;

enum CreditNoteResponseStatus: string
{
    case Draft = "DRAFT";
    case Finalized = "FINALIZED";
    case Voided = "VOIDED";
}
