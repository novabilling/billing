<?php

namespace NovaBilling\PaymentMethods\Types;

enum CreatePaymentMethodDtoType: string
{
    case Card = "CARD";
    case BankAccount = "BANK_ACCOUNT";
    case Wallet = "WALLET";
}
