---
seo:
  title: NovaBilling Docs - Borderless Billing for Africa & Beyond
  description: One unified API for subscriptions, invoices, and payments. Connect Stripe, Flutterwave, Paystack, and M-Pesa through a single integration.
navigation: false
---

::u-page-hero
#title
One API. Every payment provider. :br Billing without borders.

#description
NovaBilling is an open billing platform inspired by Stripe's developer experience and Lago's flexibility -- purpose-built for Africa and the world. Connect Stripe, Flutterwave, Paystack, and M-Pesa through a single, unified API. Manage customers, subscriptions, invoices, and payments across 17 currencies.

#links
  :::u-button
  ---
  size: xl
  to: /getting-started/quickstart
  trailing-icon: i-lucide-arrow-right
  ---
  Get Started
  :::

  :::u-button
  ---
  color: neutral
  size: xl
  to: http://localhost:3000/api/reference
  target: _blank
  variant: outline
  ---
  API Reference
  :::
::

::u-page-section
#title
Why NovaBilling?

#default
  :::card-group
    ::::card
    ---
    icon: i-lucide-globe
    title: Borderless by Default
    to: /guides/payment-providers
    ---
    Support 17 currencies across 40+ countries. Automatic currency matching routes payments to the right provider -- from mobile money in Nairobi to card payments in New York.
    ::::

    ::::card
    ---
    icon: i-lucide-building-2
    title: Multi-Tenant Architecture
    to: /getting-started/quickstart
    ---
    Every tenant gets an isolated database with encrypted credentials. Built for SaaS platforms that need to offer billing to their own customers.
    ::::

    ::::card
    ---
    icon: i-lucide-zap
    title: Ship in Minutes
    to: /sdks/typescript
    ---
    Type-safe TypeScript and Python SDKs generated from our OpenAPI spec. Full autocomplete, comprehensive error handling, and always in sync with the API.
    ::::

    ::::card
    ---
    icon: i-lucide-credit-card
    title: 4 Payment Providers
    to: /guides/payment-providers
    ---
    Stripe for global cards. Flutterwave & Paystack for West Africa. M-Pesa for East Africa. Automatic failover between providers when one is unavailable.
    ::::

    ::::card
    ---
    icon: i-lucide-refresh-cw
    title: Smart Subscriptions
    to: /guides/subscriptions
    ---
    Free trials, plan upgrades, downgrades, pausing, resuming, and automated renewals. Proration and dunning handled automatically.
    ::::

    ::::card
    ---
    icon: i-lucide-file-text
    title: Invoices & Checkout
    to: /guides/invoices-and-payments
    ---
    Auto-generate PDF invoices. Create hosted checkout URLs for any invoice. Email delivery on every billing event with automatic retries.
    ::::

    ::::card
    ---
    icon: i-lucide-bar-chart-3
    title: Revenue Analytics
    to: /guides/analytics
    ---
    Track revenue, subscriptions, churn, and payment success rates. Filter by date range, currency, and provider with daily, weekly, or monthly grouping.
    ::::

    ::::card
    ---
    icon: i-lucide-bell
    title: Real-Time Webhooks
    to: /guides/webhooks
    ---
    Signature-verified webhook notifications for every event -- payments, subscriptions, invoices. Automatic retries with exponential backoff.
    ::::

    ::::card
    ---
    icon: i-lucide-lock
    title: Enterprise Security
    to: /getting-started/authentication
    ---
    AES-256 credential encryption, JWT + API key dual authentication, scoped permissions, and rate limiting out of the box.
    ::::
  :::
::

::u-page-section
#title
Get Started in 60 Seconds

#description
Install an SDK and create your first subscription.

#default
  :::code-group{sync="pkg"}

  ```bash [npm]
  npm install novabilling
  ```

  ```bash [pip]
  pip install novabilling
  ```

  :::

  :::code-group{sync="lang"}

  ```typescript [TypeScript]
  import { NovaBillingClient } from 'novabilling';

  const nova = new NovaBillingClient({
    token: process.env.NOVA_API_KEY,
  });

  // Create a customer
  const customer = await nova.customers.create({
    externalId: 'usr_001',
    email: 'amina@kampaltech.ug',
    name: 'Amina Nakato',
    currency: 'UGX',
  });

  // Subscribe them to a plan
  const sub = await nova.subscriptions.create({
    customerId: customer.id,
    planId: 'plan_growth',
    currency: 'UGX',
  });

  console.log(sub.status); // "ACTIVE"
  ```

  ```python [Python]
  import os
  from novabilling import NovaBilling

  nova = NovaBilling(token=os.environ["NOVA_API_KEY"])

  # Create a customer
  customer = nova.customers.create(
      external_id="usr_001",
      email="amina@kampaltech.ug",
      name="Amina Nakato",
      currency="UGX",
  )

  # Subscribe them to a plan
  sub = nova.subscriptions.create(
      customer_id=customer.id,
      plan_id="plan_growth",
      currency="UGX",
  )

  print(sub.status)  # "ACTIVE"
  ```

  ```bash [cURL]
  # Create a customer
  curl -X POST http://localhost:3000/api/customers \
    -H "Authorization: Bearer sk_live_..." \
    -H "Content-Type: application/json" \
    -d '{
      "externalId": "usr_001",
      "email": "amina@kampaltech.ug",
      "name": "Amina Nakato",
      "currency": "UGX"
    }'

  # Create a subscription
  curl -X POST http://localhost:3000/api/subscriptions \
    -H "Authorization: Bearer sk_live_..." \
    -H "Content-Type: application/json" \
    -d '{
      "customerId": "cust_abc123",
      "planId": "plan_growth",
      "currency": "UGX"
    }'
  ```

  :::

  :::tip{to="/getting-started/quickstart"}
  **Ready to dive deeper?** Follow the full [Quickstart Guide](/getting-started/quickstart) for a complete walkthrough -- from registration to your first payment.
  :::
::

::u-page-section
#title
Supported Currencies

#description
NovaBilling supports **17 currencies** across Africa and internationally.

#default
  | Region | Currencies |
  |--------|-----------|
  | **West Africa** | `NGN` `GHS` `XOF` |
  | **East Africa** | `KES` `UGX` `TZS` `RWF` `ETB` |
  | **North Africa** | `EGP` `MAD` `DZD` |
  | **Central Africa** | `XAF` |
  | **Southern Africa** | `ZAR` `ZMW` |
  | **International** | `USD` `EUR` `GBP` |
::

::u-page-section
#title
Explore the Docs

#default
  :::card-group
    ::::card
    ---
    icon: i-lucide-play
    title: Quickstart
    to: /getting-started/quickstart
    ---
    Register, create API keys, configure a payment provider, and start billing in under 5 minutes.
    ::::

    ::::card
    ---
    icon: i-lucide-key
    title: Authentication
    to: /getting-started/authentication
    ---
    Understand JWT tokens for tenant management and API keys for data operations.
    ::::

    ::::card
    ---
    icon: i-lucide-code
    title: TypeScript SDK
    to: /sdks/typescript
    ---
    Full reference for the NovaBillingClient with type-safe methods for every resource.
    ::::

    ::::card
    ---
    icon: i-lucide-terminal
    title: Python SDK
    to: /sdks/python
    ---
    Sync and async clients with comprehensive type hints and error handling.
    ::::
  :::
::
