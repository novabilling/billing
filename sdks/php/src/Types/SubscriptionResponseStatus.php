<?php

namespace NovaBilling\Types;

enum SubscriptionResponseStatus: string
{
    case Active = "ACTIVE";
    case PastDue = "PAST_DUE";
    case Canceled = "CANCELED";
    case Trialing = "TRIALING";
    case Paused = "PAUSED";
}
