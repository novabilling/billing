<?php

namespace NovaBilling\Subscriptions\Types;

enum CreateSubscriptionDtoStatus: string
{
    case Active = "ACTIVE";
    case Trialing = "TRIALING";
    case Paused = "PAUSED";
    case PastDue = "PAST_DUE";
    case Canceled = "CANCELED";
}
