# Reference
## Auth
<details><summary><code>client.auth.<a href="/lib/novabilling/auth/client.rb">register</a>(request) -> Novabilling::Types::RegisterResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new tenant account with a company name. This provisions an isolated database, generates an API key, and returns JWT tokens.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.auth.register(
  name: 'John Doe',
  email: 'john@company.com',
  password: 'securePassword123',
  company_name: 'Acme Corp'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**name:** `String` — Full name of the tenant owner
    
</dd>
</dl>

<dl>
<dd>

**email:** `String` — Email address
    
</dd>
</dl>

<dl>
<dd>

**password:** `String` — Password (min 8 characters)
    
</dd>
</dl>

<dl>
<dd>

**company_name:** `String` — Company name (used to generate slug)
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Auth::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/lib/novabilling/auth/client.rb">login</a>(request) -> Novabilling::Types::LoginResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Authenticate with email and password. Returns an access token and refresh token.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.auth.login(
  email: 'john@company.com',
  password: 'securePassword123'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**email:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**password:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Auth::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/lib/novabilling/auth/client.rb">refresh_token</a>(request) -> Novabilling::Types::TokenPairResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Exchange a valid refresh token for a new access/refresh token pair.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.auth.refresh_token(refresh_token: 'refreshToken');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**refresh_token:** `String` — Refresh token
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Auth::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/lib/novabilling/auth/client.rb">forgot_password</a>(request) -> Novabilling::Types::MessageResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Send a password reset email to the specified address. Always returns success to prevent email enumeration.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.auth.forgot_password(email: 'john@company.com');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**email:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Auth::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/lib/novabilling/auth/client.rb">reset_password</a>(request) -> Novabilling::Types::MessageResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Set a new password using the token received via email.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.auth.reset_password(
  token: 'token',
  new_password: 'newSecurePassword123'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**token:** `String` — Password reset token
    
</dd>
</dl>

<dl>
<dd>

**new_password:** `String` — New password (min 8 characters)
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Auth::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Tenants
<details><summary><code>client.tenants.<a href="/lib/novabilling/tenants/client.rb">get_me</a>() -> Novabilling::Types::TenantResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the authenticated tenant's profile including settings and webhook configuration.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.tenants.get_me();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::Tenants::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.tenants.<a href="/lib/novabilling/tenants/client.rb">update_me</a>(request) -> Novabilling::Types::TenantResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update tenant profile fields such as company name, webhook URL, or custom settings.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.tenants.update_me();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**email:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**webhook_url:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**settings:** `Internal::Types::Hash[String, Object]` — Custom tenant settings (merged with existing)
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Tenants::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.tenants.<a href="/lib/novabilling/tenants/client.rb">get_usage</a>() -> Novabilling::Types::TenantUsageResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve usage metrics including customer count, active subscriptions, and total revenue.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.tenants.get_usage();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::Tenants::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.tenants.<a href="/lib/novabilling/tenants/client.rb">test_smtp</a>(request) -> Novabilling::Types::MessageResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Send a test email using the tenant's saved SMTP settings (or system defaults if not configured). Only requires recipient email address.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.tenants.test_smtp(to: 'test@example.com');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**to:** `String` — Recipient email address
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Tenants::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## APIKeys
<details><summary><code>client.api_keys.<a href="/lib/novabilling/api_keys/client.rb">list</a>() -> Internal::Types::Array[Novabilling::Types::APIKeyResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all API keys for the tenant. Keys are masked for security — only the last 8 characters are shown.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.api_keys.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::APIKeys::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.api_keys.<a href="/lib/novabilling/api_keys/client.rb">create</a>(request) -> Novabilling::Types::APIKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Generate a new API key with specified scopes. The full key is returned only once in the response — store it securely.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.api_keys.create(
  name: 'Production API Key',
  scopes: ['read', 'write']
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**scopes:** `Internal::Types::Array[String]` 
    
</dd>
</dl>

<dl>
<dd>

**expires_at:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::APIKeys::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.api_keys.<a href="/lib/novabilling/api_keys/client.rb">delete</a>(id) -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Permanently revoke an API key. Any requests using this key will immediately fail.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.api_keys.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — API key ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::APIKeys::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Currencies
<details><summary><code>client.currencies.<a href="/lib/novabilling/currencies/client.rb">list</a>() -> Internal::Types::Array[Novabilling::Types::CurrencyResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all supported currencies with their symbols and metadata.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.currencies.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::Currencies::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Customers
<details><summary><code>client.customers.<a href="/lib/novabilling/customers/client.rb">list</a>() -> Novabilling::Types::PaginatedCustomerResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a paginated list of customers. Supports filtering by search term, country, and currency.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.customers.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**search:** `String` — Search by name or email
    
</dd>
</dl>

<dl>
<dd>

**country:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**sort_by:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**sort_order:** `Novabilling::Customers::Types::ListCustomersRequestSortOrder` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Customers::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/lib/novabilling/customers/client.rb">create</a>(request) -> Novabilling::Types::CustomerResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a customer record. The externalId should be unique and map to your application's user ID.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.customers.create(
  external_id: 'user_12345',
  email: 'customer@example.com',
  currency: 'NGN'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**external_id:** `String` — Tenant's user ID
    
</dd>
</dl>

<dl>
<dd>

**email:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**country:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — ISO currency code
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Internal::Types::Hash[String, Object]` — Custom metadata
    
</dd>
</dl>

<dl>
<dd>

**net_payment_terms:** `Integer` — Net payment terms in days (overrides org and plan defaults)
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `String` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Customers::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/lib/novabilling/customers/client.rb">get</a>(id) -> Novabilling::Types::CustomerResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve detailed information about a specific customer including their billing history summary.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.customers.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Customers::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/lib/novabilling/customers/client.rb">delete</a>(id) -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Permanently delete a customer. Fails if the customer has active subscriptions.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.customers.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Customers::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/lib/novabilling/customers/client.rb">update</a>(id, request) -> Novabilling::Types::CustomerResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update customer fields. Only provided fields will be changed.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.customers.update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**external_id:** `String` — Tenant's user ID
    
</dd>
</dl>

<dl>
<dd>

**email:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**country:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — ISO currency code
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Internal::Types::Hash[String, Object]` — Custom metadata
    
</dd>
</dl>

<dl>
<dd>

**net_payment_terms:** `Integer` — Net payment terms in days (overrides org and plan defaults)
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `String` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Customers::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/lib/novabilling/customers/client.rb">get_subscriptions</a>(id) -> Internal::Types::Array[Novabilling::Types::SubscriptionResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all subscriptions for a specific customer.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.customers.get_subscriptions(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Customers::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/lib/novabilling/customers/client.rb">get_invoices</a>(id) -> Internal::Types::Array[Novabilling::Types::InvoiceResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all invoices for a specific customer.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.customers.get_invoices(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Customers::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/lib/novabilling/customers/client.rb">get_payments</a>(id) -> Internal::Types::Array[Novabilling::Types::PaymentResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all payments made by a specific customer.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.customers.get_payments(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Customers::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/lib/novabilling/customers/client.rb">get_payment_methods</a>(id) -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve saved payment methods (cards, tokens) for a customer.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.customers.get_payment_methods(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Customers::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/lib/novabilling/customers/client.rb">add_payment_method</a>(id) -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.customers.add_payment_method(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Customers::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/lib/novabilling/customers/client.rb">delete_payment_method</a>(id, method_id) -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove a saved payment method from a customer.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.customers.delete_payment_method(
  id: 'id',
  method_id: 'methodId'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**method_id:** `String` — Payment method ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Customers::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Plans
<details><summary><code>client.plans.<a href="/lib/novabilling/plans/client.rb">list</a>() -> Internal::Types::Array[Novabilling::Types::PlanResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all billing plans with their prices. Optionally filter by active status.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plans.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**is_active:** `Internal::Types::Boolean` — Filter by active status
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Plans::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/lib/novabilling/plans/client.rb">create</a>(request) -> Novabilling::Types::PlanResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a billing plan with a unique code. Optionally include prices for different currencies. Plans can have MONTHLY, QUARTERLY, or YEARLY billing intervals.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plans.create(
  name: 'Premium Monthly',
  code: 'premium_monthly',
  billing_interval: 'HOURLY'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**code:** `String` — Unique plan code (lowercase, underscores)
    
</dd>
</dl>

<dl>
<dd>

**description:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**billing_interval:** `Novabilling::Plans::Types::CreatePlanDtoBillingInterval` 
    
</dd>
</dl>

<dl>
<dd>

**billing_timing:** `Novabilling::Plans::Types::CreatePlanDtoBillingTiming` — When to charge: IN_ADVANCE (at period start) or IN_ARREARS (at period end). Defaults to IN_ARREARS.
    
</dd>
</dl>

<dl>
<dd>

**features:** `Internal::Types::Array[String]` 
    
</dd>
</dl>

<dl>
<dd>

**prices:** `Internal::Types::Array[Novabilling::Types::CreatePlanPriceDto]` 
    
</dd>
</dl>

<dl>
<dd>

**net_payment_terms:** `Integer` — Net payment terms in days (overrides org default)
    
</dd>
</dl>

<dl>
<dd>

**invoice_grace_period_days:** `Integer` — Grace period in days before draft invoices are finalized
    
</dd>
</dl>

<dl>
<dd>

**progressive_billing_threshold:** `Integer` — Usage cost threshold for mid-cycle progressive billing invoices
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Plans::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/lib/novabilling/plans/client.rb">get</a>(id) -> Novabilling::Types::PlanResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a plan with all its prices and features.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plans.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Plans::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/lib/novabilling/plans/client.rb">delete</a>(id) -> Novabilling::Types::PlanResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a billing plan. Plans with active subscriptions should be deactivated instead.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plans.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Plans::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/lib/novabilling/plans/client.rb">update</a>(id, request) -> Novabilling::Types::PlanResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update plan details like name, description, features, or billing interval.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plans.update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**billing_interval:** `Novabilling::Plans::Types::UpdatePlanDtoBillingInterval` 
    
</dd>
</dl>

<dl>
<dd>

**billing_timing:** `Novabilling::Plans::Types::UpdatePlanDtoBillingTiming` — When to charge: IN_ADVANCE or IN_ARREARS
    
</dd>
</dl>

<dl>
<dd>

**features:** `Internal::Types::Array[String]` 
    
</dd>
</dl>

<dl>
<dd>

**is_active:** `Internal::Types::Boolean` 
    
</dd>
</dl>

<dl>
<dd>

**net_payment_terms:** `Integer` — Net payment terms in days
    
</dd>
</dl>

<dl>
<dd>

**invoice_grace_period_days:** `Integer` — Grace period in days before draft invoices are finalized
    
</dd>
</dl>

<dl>
<dd>

**progressive_billing_threshold:** `Integer` — Usage cost threshold for progressive billing
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Plans::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/lib/novabilling/plans/client.rb">add_price</a>(id, request) -> Novabilling::Types::PlanPriceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add a price in a specific currency to a plan. Each plan can have one price per currency.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plans.add_price(
  id: 'id',
  currency: 'NGN',
  amount: 9999.99
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `Novabilling::Types::CreatePlanPriceDto` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Plans::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/lib/novabilling/plans/client.rb">delete_price</a>(id, price_id) -> Novabilling::Types::PlanPriceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove a price from a plan. Active subscriptions using this price will not be affected.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plans.delete_price(
  id: 'id',
  price_id: 'priceId'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**price_id:** `String` — Price ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Plans::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/lib/novabilling/plans/client.rb">update_price</a>(id, price_id) -> Novabilling::Types::PlanPriceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Change the amount for an existing price on a plan.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plans.update_price(
  id: 'id',
  price_id: 'priceId'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**price_id:** `String` — Price ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Plans::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Subscriptions
<details><summary><code>client.subscriptions.<a href="/lib/novabilling/subscriptions/client.rb">list</a>() -> Novabilling::Types::PaginatedSubscriptionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a paginated list of subscriptions. Supports filtering by status, customer, and plan.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.subscriptions.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**status:** `String` — Filter by status (ACTIVE, TRIALING, PAUSED, CANCELED)
    
</dd>
</dl>

<dl>
<dd>

**customer_id:** `String` — Filter by customer ID
    
</dd>
</dl>

<dl>
<dd>

**plan_id:** `String` — Filter by plan ID
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Subscriptions::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/lib/novabilling/subscriptions/client.rb">create</a>(request) -> Novabilling::Types::SubscriptionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Subscribe a customer to a plan. The plan must have a price matching the specified currency. Optionally set a trial period in days.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.subscriptions.create(
  customer_id: 'customerId',
  plan_id: 'planId',
  currency: 'NGN'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**plan_id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — Currency for billing
    
</dd>
</dl>

<dl>
<dd>

**trial_days:** `Integer` — Number of trial days
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Internal::Types::Hash[String, Object]` 
    
</dd>
</dl>

<dl>
<dd>

**start_date:** `String` — Override subscription start date (ISO 8601). Defaults to now.
    
</dd>
</dl>

<dl>
<dd>

**current_period_end:** `String` — Override current period end (ISO 8601). Defaults to calculated from startDate + billing interval.
    
</dd>
</dl>

<dl>
<dd>

**status:** `Novabilling::Subscriptions::Types::CreateSubscriptionDtoStatus` — Override subscription status for imports
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `String` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>

<dl>
<dd>

**external_id:** `String` — External ID for linking to external systems
    
</dd>
</dl>

<dl>
<dd>

**canceled_at:** `String` — Canceled at date (ISO 8601). For importing canceled subscriptions.
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Subscriptions::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/lib/novabilling/subscriptions/client.rb">get</a>(id) -> Novabilling::Types::SubscriptionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve detailed subscription information including customer, plan with prices, and recent invoices.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.subscriptions.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Subscriptions::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/lib/novabilling/subscriptions/client.rb">update</a>(id, request) -> Novabilling::Types::SubscriptionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the metadata field on a subscription. Other fields cannot be changed directly.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.subscriptions.update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Internal::Types::Hash[String, Object]` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Subscriptions::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/lib/novabilling/subscriptions/client.rb">cancel</a>(id, request) -> Novabilling::Types::SubscriptionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Cancel a subscription either immediately or at the end of the current billing period. When set to "period_end", the subscription remains active until the current period expires.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.subscriptions.cancel(
  id: 'id',
  cancel_at: 'now'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**cancel_at:** `Novabilling::Subscriptions::Types::CancelSubscriptionDtoCancelAt` — When to cancel: immediately or at end of current period
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Subscriptions::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/lib/novabilling/subscriptions/client.rb">pause</a>(id) -> Novabilling::Types::SubscriptionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Temporarily pause an active subscription. Only active subscriptions can be paused.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.subscriptions.pause(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Subscriptions::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/lib/novabilling/subscriptions/client.rb">resume</a>(id) -> Novabilling::Types::SubscriptionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Resume a previously paused subscription back to active status.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.subscriptions.resume(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Subscriptions::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/lib/novabilling/subscriptions/client.rb">change_plan</a>(id, request) -> Novabilling::Types::SubscriptionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Switch a subscription to a different plan. The new plan must have a price for the subscription's currency. A new billing period starts immediately with the new plan.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.subscriptions.change_plan(
  id: 'id',
  new_plan_id: 'newPlanId'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**new_plan_id:** `String` — New plan ID
    
</dd>
</dl>

<dl>
<dd>

**prorate:** `Internal::Types::Boolean` — Whether to prorate charges
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Subscriptions::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Invoices
<details><summary><code>client.invoices.<a href="/lib/novabilling/invoices/client.rb">list</a>() -> Novabilling::Types::PaginatedInvoiceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a paginated list of invoices. Supports filtering by status, customer, and date range.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.invoices.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**status:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**customer_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**date_from:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Invoices::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/lib/novabilling/invoices/client.rb">create</a>(request) -> Novabilling::Types::InvoiceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a draft invoice with line items. The total amount is automatically calculated from the items.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.invoices.create(
  customer_id: 'customerId',
  items: [{
    description: 'Premium Monthly Plan',
    quantity: 1,
    unit_amount: 9999.99
  }],
  due_date: '2025-02-15'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**subscription_id:** `String` — Subscription ID (optional)
    
</dd>
</dl>

<dl>
<dd>

**items:** `Internal::Types::Array[Novabilling::Types::InvoiceItemDto]` 
    
</dd>
</dl>

<dl>
<dd>

**due_date:** `String` — Due date
    
</dd>
</dl>

<dl>
<dd>

**status:** `Novabilling::Invoices::Types::CreateInvoiceDtoStatus` — Override invoice status for imports
    
</dd>
</dl>

<dl>
<dd>

**invoice_number:** `String` — Override invoice number (e.g. INV-00042). Auto-generated if omitted.
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — Currency override (defaults to customer currency)
    
</dd>
</dl>

<dl>
<dd>

**paid_at:** `String` — Paid at date (ISO 8601). For importing paid invoices.
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `String` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Invoices::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/lib/novabilling/invoices/client.rb">get</a>(id) -> Novabilling::Types::InvoiceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve detailed invoice information including associated customer, subscription, and payments.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.invoices.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Invoices::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/lib/novabilling/invoices/client.rb">finalize</a>(id) -> Novabilling::Types::InvoiceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Move an invoice from draft to pending status, making it ready for payment.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.invoices.finalize(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Invoices::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/lib/novabilling/invoices/client.rb">void</a>(id) -> Novabilling::Types::InvoiceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Cancel an unpaid invoice. Paid invoices cannot be voided — use a refund instead.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.invoices.void(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Invoices::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/lib/novabilling/invoices/client.rb">mark_paid</a>(id, request) -> Novabilling::Types::InvoiceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Record an offline or manual payment against an invoice. Accepts an optional paymentMethod (e.g. "cash", "bank_transfer", "check", "manual").
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.invoices.mark_paid(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**payment_method:** `String` — Payment method used (cash, bank_transfer, check, manual). Defaults to "manual".
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Invoices::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/lib/novabilling/invoices/client.rb">create_checkout</a>(id, request) -> Novabilling::Types::CheckoutResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Initiate a payment session with the configured payment provider (Stripe, Paystack, Flutterwave, or M-Pesa). Returns a checkout URL that redirects the customer to the provider's hosted payment page.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.invoices.create_checkout(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**callback_url:** `String` — URL to redirect customer after payment
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Invoices::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/lib/novabilling/invoices/client.rb">send_email</a>(id, request) -> Novabilling::Types::MessageResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Send the invoice to a specified email address, or to the customer's email if none is provided.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.invoices.send_email(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**email:** `String` — Recipient email address. Defaults to the customer email if omitted.
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Invoices::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/lib/novabilling/invoices/client.rb">get_pdf</a>(id) -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the PDF binary for the invoice. If a PDF has not been generated yet, it will be created on-demand.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.invoices.get_pdf(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Invoices::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Payments
<details><summary><code>client.payments.<a href="/lib/novabilling/payments/client.rb">list</a>() -> Novabilling::Types::PaginatedPaymentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a paginated list of payments. Supports filtering by status, provider, invoice, and date range.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payments.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**status:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**provider:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**date_from:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Payments::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payments.<a href="/lib/novabilling/payments/client.rb">payments_controller_create</a>(request) -> Novabilling::Types::PaymentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a payment record manually. Useful for importing historical data. If status is SUCCEEDED, the associated invoice will also be marked as paid.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payments.payments_controller_create(
  invoice_id: 'invoiceId',
  provider: 'manual',
  amount: 49.99,
  currency: 'USD',
  status: 'PROCESSING'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**invoice_id:** `String` — Invoice ID this payment is for
    
</dd>
</dl>

<dl>
<dd>

**provider:** `String` — Payment provider name (e.g. stripe, paystack, manual)
    
</dd>
</dl>

<dl>
<dd>

**amount:** `Integer` — Payment amount
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — Currency
    
</dd>
</dl>

<dl>
<dd>

**status:** `Novabilling::Payments::Types::CreatePaymentDtoStatus` — Payment status
    
</dd>
</dl>

<dl>
<dd>

**provider_transaction_id:** `String` — Provider transaction ID
    
</dd>
</dl>

<dl>
<dd>

**failure_reason:** `String` — Failure reason (for FAILED payments)
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `String` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Payments::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payments.<a href="/lib/novabilling/payments/client.rb">get</a>(id) -> Novabilling::Types::PaymentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve detailed payment information including the associated invoice and customer.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payments.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Payment ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Payments::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payments.<a href="/lib/novabilling/payments/client.rb">refund</a>(id, request) -> Novabilling::Types::PaymentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Issue a full or partial refund for a succeeded payment. If amount is omitted, the full payment amount is refunded.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payments.refund(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Payment ID
    
</dd>
</dl>

<dl>
<dd>

**amount:** `Integer` — Amount to refund (full refund if omitted)
    
</dd>
</dl>

<dl>
<dd>

**reason:** `String` — Reason for refund
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Payments::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Payment Providers
<details><summary><code>client.payment_providers.<a href="/lib/novabilling/payment_providers/client.rb">list</a>() -> Internal::Types::Array[Novabilling::Types::PaymentProviderResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all configured payment providers for the tenant. Credentials are never returned.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_providers.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::PaymentProviders::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_providers.<a href="/lib/novabilling/payment_providers/client.rb">configure</a>(request) -> Novabilling::Types::PaymentProviderResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Set up a payment provider (stripe, paystack, flutterwave, or mpesa) with encrypted credentials. The provider with the lowest priority number is used by default for checkout.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_providers.configure(
  provider_name: 'flutterwave',
  credentials: {}
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**provider_name:** `String` — Provider name
    
</dd>
</dl>

<dl>
<dd>

**credentials:** `Internal::Types::Hash[String, Object]` — Provider credentials (will be encrypted)
    
</dd>
</dl>

<dl>
<dd>

**is_active:** `Internal::Types::Boolean` 
    
</dd>
</dl>

<dl>
<dd>

**priority:** `Integer` — Priority (lower = higher)
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PaymentProviders::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_providers.<a href="/lib/novabilling/payment_providers/client.rb">get</a>(id) -> Novabilling::Types::PaymentProviderResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a specific payment provider configuration. Credentials are not included.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_providers.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Payment provider ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PaymentProviders::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_providers.<a href="/lib/novabilling/payment_providers/client.rb">delete</a>(id) -> Novabilling::Types::PaymentProviderResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove a payment provider configuration. This does not affect existing payments.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_providers.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Payment provider ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PaymentProviders::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_providers.<a href="/lib/novabilling/payment_providers/client.rb">update</a>(id, request) -> Novabilling::Types::PaymentProviderResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update provider settings such as active status, priority, or credentials.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_providers.update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Payment provider ID
    
</dd>
</dl>

<dl>
<dd>

**provider_name:** `String` — Provider name
    
</dd>
</dl>

<dl>
<dd>

**credentials:** `Internal::Types::Hash[String, Object]` — Provider credentials (will be encrypted)
    
</dd>
</dl>

<dl>
<dd>

**is_active:** `Internal::Types::Boolean` 
    
</dd>
</dl>

<dl>
<dd>

**priority:** `Integer` — Priority (lower = higher)
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PaymentProviders::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_providers.<a href="/lib/novabilling/payment_providers/client.rb">test_connection</a>(id) -> Novabilling::Types::ProviderTestResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Verify that the provider credentials are valid by making a test API call to the provider.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_providers.test_connection(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Payment provider ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PaymentProviders::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Webhooks
<details><summary><code>client.webhooks.<a href="/lib/novabilling/webhooks/client.rb">webhooks_controller_paystack</a>() -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Receives payment event notifications from Paystack. The signature is verified using HMAC-SHA512 with the provider's secret key. On success, updates the payment/invoice status and sends customer notifications.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.webhooks.webhooks_controller_paystack(paystack_signature: 'x-paystack-signature');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**paystack_signature:** `String` — Paystack HMAC-SHA512 signature
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Webhooks::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/lib/novabilling/webhooks/client.rb">webhooks_controller_flutterwave</a>() -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Receives payment event notifications from Flutterwave. Verified using the verif-hash header against the configured encryption key.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.webhooks.webhooks_controller_flutterwave();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**verif_hash:** `String` — Flutterwave verification hash
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Webhooks::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/lib/novabilling/webhooks/client.rb">webhooks_controller_dpo</a>() -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Receives payment callback notifications from DPO Group (DirectPay Online). Verifies the transaction token status and updates payment accordingly.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.webhooks.webhooks_controller_dpo();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::Webhooks::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/lib/novabilling/webhooks/client.rb">webhooks_controller_payu</a>() -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Receives Instant Payment Notifications (IPN) from PayU South Africa. Updates payment status based on the transaction state.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.webhooks.webhooks_controller_payu();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::Webhooks::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/lib/novabilling/webhooks/client.rb">webhooks_controller_pesapal</a>() -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Receives IPN (Instant Payment Notification) callbacks from Pesapal. Fetches transaction status using the OrderTrackingId and updates payment.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.webhooks.webhooks_controller_pesapal();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::Webhooks::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/lib/novabilling/webhooks/client.rb">webhooks_controller_stripe</a>() -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Receives event notifications from Stripe (e.g. checkout.session.completed, payment_intent.succeeded). Verified using the stripe-signature header with the configured webhook secret.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.webhooks.webhooks_controller_stripe(stripe_signature: 'stripe-signature');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**stripe_signature:** `String` — Stripe webhook signature
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Webhooks::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Analytics
<details><summary><code>client.analytics.<a href="/lib/novabilling/analytics/client.rb">get_revenue</a>() -> Novabilling::Types::RevenueAnalyticsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve revenue metrics including total revenue, MRR (monthly recurring revenue), and revenue breakdown by period. Supports filtering by date range and currency.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.analytics.get_revenue(
  date_from: '2025-01-01',
  date_to: '2025-12-31'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**date_from:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Novabilling::Analytics::Types::GetRevenueAnalyticsRequestGroupBy` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Analytics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/lib/novabilling/analytics/client.rb">get_subscriptions</a>() -> Novabilling::Types::SubscriptionAnalyticsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve subscription metrics including active count, churn rate, new subscriptions, and status distribution.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.analytics.get_subscriptions(
  date_from: '2025-01-01',
  date_to: '2025-12-31'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**date_from:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Novabilling::Analytics::Types::GetSubscriptionsAnalyticsRequestGroupBy` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Analytics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/lib/novabilling/analytics/client.rb">get_customers</a>() -> Novabilling::Types::CustomerAnalyticsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve customer metrics including total count, new customers, and geographic distribution.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.analytics.get_customers(
  date_from: '2025-01-01',
  date_to: '2025-12-31'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**date_from:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Novabilling::Analytics::Types::GetCustomersAnalyticsRequestGroupBy` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Analytics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/lib/novabilling/analytics/client.rb">get_payments</a>() -> Novabilling::Types::PaymentAnalyticsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve payment metrics including success rate, failure rate, total volume, and breakdown by payment provider.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.analytics.get_payments(
  date_from: '2025-01-01',
  date_to: '2025-12-31'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**date_from:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Novabilling::Analytics::Types::GetPaymentsAnalyticsRequestGroupBy` 
    
</dd>
</dl>

<dl>
<dd>

**provider:** `String` — Filter by payment provider name
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Analytics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/lib/novabilling/analytics/client.rb">get_mrr_breakdown</a>() -> Novabilling::Types::MrrBreakdownResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

MRR breakdown by movement type (new, expansion, contraction, churn) and by plan.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.analytics.get_mrr_breakdown(
  date_from: '2025-01-01',
  date_to: '2025-12-31'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**date_from:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Novabilling::Analytics::Types::GetMrrBreakdownAnalyticsRequestGroupBy` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Analytics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/lib/novabilling/analytics/client.rb">get_net_revenue</a>() -> Novabilling::Types::NetRevenueResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gross revenue minus refunds and credit notes.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.analytics.get_net_revenue(
  date_from: '2025-01-01',
  date_to: '2025-12-31'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**date_from:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Novabilling::Analytics::Types::GetNetRevenueAnalyticsRequestGroupBy` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Analytics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/lib/novabilling/analytics/client.rb">get_churn_cohorts</a>() -> Novabilling::Types::ChurnCohortsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Monthly cohort retention matrix showing what percentage of each cohort is retained over time.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.analytics.get_churn_cohorts();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**months:** `Integer` — Number of months to analyze (default 12)
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Analytics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/lib/novabilling/analytics/client.rb">get_lifetime_value</a>() -> Novabilling::Types::LtvResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Average customer LTV and lifespan, broken down by plan.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.analytics.get_lifetime_value();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::Analytics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Coupons
<details><summary><code>client.coupons.<a href="/lib/novabilling/coupons/client.rb">list</a>() -> Novabilling::Types::PaginatedCouponResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a paginated list of coupons.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.coupons.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**is_active:** `Internal::Types::Boolean` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Coupons::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/lib/novabilling/coupons/client.rb">create</a>(request) -> Novabilling::Types::CouponResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new discount coupon.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.coupons.create(
  code: 'WELCOME20',
  name: '20% Welcome Discount',
  discount_type: 'PERCENTAGE',
  discount_value: 20
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**code:** `String` — Unique coupon code
    
</dd>
</dl>

<dl>
<dd>

**name:** `String` — Display name
    
</dd>
</dl>

<dl>
<dd>

**description:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**discount_type:** `Novabilling::Coupons::Types::CreateCouponDtoDiscountType` 
    
</dd>
</dl>

<dl>
<dd>

**discount_value:** `Integer` — Discount value (percentage 0-100 or fixed amount)
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — Currency for FIXED_AMOUNT discounts
    
</dd>
</dl>

<dl>
<dd>

**max_redemptions:** `Integer` — Max number of redemptions (null = unlimited)
    
</dd>
</dl>

<dl>
<dd>

**applies_to_plan_ids:** `Internal::Types::Array[String]` — Plan IDs this coupon applies to (empty = all)
    
</dd>
</dl>

<dl>
<dd>

**expires_at:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `String` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Coupons::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/lib/novabilling/coupons/client.rb">get</a>(id) -> Novabilling::Types::CouponResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.coupons.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Coupon ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Coupons::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/lib/novabilling/coupons/client.rb">delete</a>(id) -> Novabilling::Types::CouponResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete or deactivate a coupon.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.coupons.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Coupon ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Coupons::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/lib/novabilling/coupons/client.rb">update</a>(id, request) -> Novabilling::Types::CouponResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.coupons.update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Coupon ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**is_active:** `Internal::Types::Boolean` 
    
</dd>
</dl>

<dl>
<dd>

**expires_at:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Coupons::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/lib/novabilling/coupons/client.rb">apply</a>(request) -> Novabilling::Types::AppliedCouponResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Apply a coupon to a specific customer, optionally linked to a subscription.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.coupons.apply(
  coupon_id: 'couponId',
  customer_id: 'customerId'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**coupon_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**customer_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**subscription_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**uses_remaining:** `Integer` — Number of billing cycles to apply (null = forever)
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Coupons::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/lib/novabilling/coupons/client.rb">remove_applied</a>(id) -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.coupons.remove_applied(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Applied coupon ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Coupons::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## AddOns
<details><summary><code>client.add_ons.<a href="/lib/novabilling/add_ons/client.rb">list</a>() -> Novabilling::Types::PaginatedAddOnResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a paginated list of add-ons with prices.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.add_ons.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::AddOns::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/lib/novabilling/add_ons/client.rb">create</a>(request) -> Novabilling::Types::AddOnResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a one-time charge add-on with multi-currency pricing.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.add_ons.create(
  name: 'Premium Support',
  code: 'premium_support',
  prices: [{
    currency: 'UGX',
    amount: 50000
  }]
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**name:** `String` — Display name
    
</dd>
</dl>

<dl>
<dd>

**code:** `String` — Unique code for the add-on
    
</dd>
</dl>

<dl>
<dd>

**description:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_display_name:** `String` — Custom name shown on invoices
    
</dd>
</dl>

<dl>
<dd>

**prices:** `Internal::Types::Array[Novabilling::Types::AddOnPriceDto]` — Prices in different currencies
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `String` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::AddOns::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/lib/novabilling/add_ons/client.rb">get</a>(id) -> Novabilling::Types::AddOnResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.add_ons.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Add-on ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::AddOns::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/lib/novabilling/add_ons/client.rb">delete</a>(id) -> Novabilling::Types::AddOnResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.add_ons.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Add-on ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::AddOns::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/lib/novabilling/add_ons/client.rb">update</a>(id, request) -> Novabilling::Types::AddOnResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.add_ons.update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Add-on ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_display_name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**prices:** `Internal::Types::Array[Novabilling::Types::AddOnPriceDto]` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::AddOns::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/lib/novabilling/add_ons/client.rb">apply</a>(request) -> Novabilling::Types::AppliedAddOnResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a one-time charge for a customer. Will be included in the next invoice.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.add_ons.apply(
  add_on_id: 'addOnId',
  customer_id: 'customerId',
  amount: 50000,
  currency: 'UGX'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**add_on_id:** `String` — Add-on ID
    
</dd>
</dl>

<dl>
<dd>

**customer_id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**subscription_id:** `String` — Subscription to attach the charge to
    
</dd>
</dl>

<dl>
<dd>

**amount:** `Integer` — Charge amount
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — Currency
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::AddOns::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/lib/novabilling/add_ons/client.rb">list_applied</a>() -> Internal::Types::Array[Novabilling::Types::AppliedAddOnResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

View one-time charges applied to customers.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.add_ons.list_applied();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**invoiced:** `Internal::Types::Boolean` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::AddOns::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/lib/novabilling/add_ons/client.rb">remove_applied</a>(id) -> Novabilling::Types::AppliedAddOnResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove a one-time charge that has not yet been invoiced.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.add_ons.remove_applied(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Applied add-on ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::AddOns::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## CreditNotes
<details><summary><code>client.credit_notes.<a href="/lib/novabilling/credit_notes/client.rb">list</a>() -> Novabilling::Types::PaginatedCreditNoteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a paginated list of credit notes.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.credit_notes.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**status:** `Novabilling::CreditNotes::Types::ListCreditNotesRequestStatus` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::CreditNotes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credit_notes.<a href="/lib/novabilling/credit_notes/client.rb">create</a>(request) -> Novabilling::Types::CreditNoteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a credit note against an invoice. Starts in DRAFT status.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.credit_notes.create(
  invoice_id: 'invoiceId',
  customer_id: 'customerId',
  amount: 25000,
  currency: 'UGX',
  reason: 'DUPLICATE'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**invoice_id:** `String` — Invoice ID to credit against
    
</dd>
</dl>

<dl>
<dd>

**customer_id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**amount:** `Integer` — Credit amount
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — Currency
    
</dd>
</dl>

<dl>
<dd>

**reason:** `Novabilling::CreditNotes::Types::CreateCreditNoteDtoReason` 
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Internal::Types::Hash[String, Object]` — Additional metadata
    
</dd>
</dl>

<dl>
<dd>

**status:** `Novabilling::CreditNotes::Types::CreateCreditNoteDtoStatus` — Override status for imports
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `String` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::CreditNotes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credit_notes.<a href="/lib/novabilling/credit_notes/client.rb">get</a>(id) -> Novabilling::Types::CreditNoteResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.credit_notes.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Credit note ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::CreditNotes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credit_notes.<a href="/lib/novabilling/credit_notes/client.rb">credit_notes_controller_update</a>(id, request) -> Novabilling::Types::CreditNoteResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.credit_notes.credit_notes_controller_update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Credit note ID
    
</dd>
</dl>

<dl>
<dd>

**amount:** `Integer` — Updated amount
    
</dd>
</dl>

<dl>
<dd>

**reason:** `Novabilling::CreditNotes::Types::UpdateCreditNoteDtoReason` 
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Internal::Types::Hash[String, Object]` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::CreditNotes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credit_notes.<a href="/lib/novabilling/credit_notes/client.rb">finalize</a>(id) -> Novabilling::Types::CreditNoteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Move a credit note from DRAFT to FINALIZED status.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.credit_notes.finalize(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Credit note ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::CreditNotes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credit_notes.<a href="/lib/novabilling/credit_notes/client.rb">void</a>(id) -> Novabilling::Types::CreditNoteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Cancel a credit note.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.credit_notes.void(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Credit note ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::CreditNotes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Portal
<details><summary><code>client.portal.<a href="/lib/novabilling/portal/client.rb">get_billing</a>(external_id) -> </code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns subscriptions, recent invoices, payments, and summary stats for a customer. Use this to render a billing dashboard for your end-users.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.portal.get_billing(external_id: 'externalId');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**external_id:** `String` — Customer external ID (your app user ID)
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Portal::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/lib/novabilling/portal/client.rb">get_subscriptions</a>(external_id) -> Internal::Types::Array[Novabilling::Types::SubscriptionResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all subscriptions for the customer with plan details.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.portal.get_subscriptions(external_id: 'externalId');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**external_id:** `String` — Customer external ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Portal::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/lib/novabilling/portal/client.rb">get_invoices</a>(external_id) -> Novabilling::Types::PaginatedInvoiceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a paginated list of invoices. Filter by status to show only pending invoices.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.portal.get_invoices(external_id: 'externalId');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**external_id:** `String` — Customer external ID
    
</dd>
</dl>

<dl>
<dd>

**status:** `Novabilling::Portal::Types::GetInvoicesPortalRequestStatus` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Portal::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/lib/novabilling/portal/client.rb">create_checkout</a>(external_id, invoice_id) -> Novabilling::Types::CheckoutResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Initiates a payment session with the configured payment provider. Returns a checkout URL to redirect the customer to.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.portal.create_checkout(
  external_id: 'externalId',
  invoice_id: 'invoiceId'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**external_id:** `String` — Customer external ID
    
</dd>
</dl>

<dl>
<dd>

**invoice_id:** `String` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Portal::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/lib/novabilling/portal/client.rb">get_payments</a>(external_id) -> Novabilling::Types::PaginatedPaymentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a paginated list of all payments made by the customer.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.portal.get_payments(external_id: 'externalId');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**external_id:** `String` — Customer external ID
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Portal::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## BillableMetrics
<details><summary><code>client.billable_metrics.<a href="/lib/novabilling/billable_metrics/client.rb">list</a>() -> Internal::Types::Array[Novabilling::Types::BillableMetricResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all billable metrics with their filters and charge counts.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.billable_metrics.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::BillableMetrics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billable_metrics.<a href="/lib/novabilling/billable_metrics/client.rb">create</a>(request) -> Novabilling::Types::BillableMetricResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new billable metric for usage-based billing. Supported aggregation types: COUNT, SUM, MAX, UNIQUE_COUNT, LATEST, WEIGHTED_SUM.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.billable_metrics.create(
  name: 'API Calls',
  code: 'api_calls',
  aggregation_type: 'COUNT'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**code:** `String` — Unique metric code
    
</dd>
</dl>

<dl>
<dd>

**description:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**aggregation_type:** `Novabilling::BillableMetrics::Types::CreateBillableMetricDtoAggregationType` 
    
</dd>
</dl>

<dl>
<dd>

**field_name:** `String` — Property key to aggregate (required for SUM, MAX, LATEST, WEIGHTED_SUM)
    
</dd>
</dl>

<dl>
<dd>

**recurring:** `Internal::Types::Boolean` — If true, value carries forward across billing periods
    
</dd>
</dl>

<dl>
<dd>

**filters:** `Internal::Types::Array[Novabilling::Types::CreateBillableMetricFilterDto]` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::BillableMetrics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billable_metrics.<a href="/lib/novabilling/billable_metrics/client.rb">get</a>(id) -> Novabilling::Types::BillableMetricResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a billable metric with its filters and associated charges.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.billable_metrics.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Billable Metric ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::BillableMetrics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billable_metrics.<a href="/lib/novabilling/billable_metrics/client.rb">delete</a>(id) -> Novabilling::Types::BillableMetricResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a billable metric. Metrics used in charges cannot be deleted.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.billable_metrics.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Billable Metric ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::BillableMetrics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billable_metrics.<a href="/lib/novabilling/billable_metrics/client.rb">update</a>(id, request) -> Novabilling::Types::BillableMetricResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update billable metric details. Code and aggregation type cannot be changed.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.billable_metrics.update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Billable Metric ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**field_name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**recurring:** `Internal::Types::Boolean` 
    
</dd>
</dl>

<dl>
<dd>

**filters:** `Internal::Types::Array[Novabilling::Types::CreateBillableMetricFilterDto]` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::BillableMetrics::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Events
<details><summary><code>client.events.<a href="/lib/novabilling/events/client.rb">list</a>() -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.events.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::Events::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/lib/novabilling/events/client.rb">create</a>(request) -> Novabilling::Types::UsageEventResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Send a single usage event. Uses transactionId for idempotency - sending the same transactionId twice will return the existing event.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.events.create(
  transaction_id: 'evt_12345',
  subscription_id: 'sub_abc123',
  code: 'api_calls'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Novabilling::Types::CreateEventDto` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Events::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/lib/novabilling/events/client.rb">create_batch</a>(request) -> Novabilling::Types::BatchEventResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Send up to 100 usage events in a single request. Each event is processed independently - failures do not affect other events.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.events.create_batch(events: [{
  transaction_id: 'evt_12345',
  subscription_id: 'sub_abc123',
  code: 'api_calls'
}]);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**events:** `Internal::Types::Array[Novabilling::Types::CreateEventDto]` — Array of events to ingest (max 100)
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Events::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/lib/novabilling/events/client.rb">get</a>(id) -> Novabilling::Types::UsageEventResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a single usage event by its ID.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.events.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Event ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Events::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/lib/novabilling/events/client.rb">get_by_subscription</a>(subscription_id) -> Novabilling::Types::PaginatedUsageEventResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve usage events for a specific subscription with optional filtering.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.events.get_by_subscription(subscription_id: 'subscriptionId');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**subscription_id:** `String` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**code:** `String` — Filter by metric code
    
</dd>
</dl>

<dl>
<dd>

**from:** `String` — Start date (ISO 8601)
    
</dd>
</dl>

<dl>
<dd>

**to:** `String` — End date (ISO 8601)
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**per_page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Events::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Charges
<details><summary><code>client.charges.<a href="/lib/novabilling/charges/client.rb">list</a>() -> Internal::Types::Array[Novabilling::Types::ChargeResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all charges, optionally filtered by plan ID.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.charges.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**plan_id:** `String` — Filter by plan ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Charges::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/lib/novabilling/charges/client.rb">create</a>(request) -> Novabilling::Types::ChargeResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a usage-based charge linking a plan to a billable metric. Supported models: STANDARD, GRADUATED, VOLUME, PACKAGE, PERCENTAGE.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.charges.create(
  plan_id: 'planId',
  billable_metric_id: 'billableMetricId',
  charge_model: 'STANDARD'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**plan_id:** `String` — Plan ID to attach this charge to
    
</dd>
</dl>

<dl>
<dd>

**billable_metric_id:** `String` — Billable metric ID
    
</dd>
</dl>

<dl>
<dd>

**charge_model:** `Novabilling::Charges::Types::CreateChargeDtoChargeModel` 
    
</dd>
</dl>

<dl>
<dd>

**billing_timing:** `Novabilling::Charges::Types::CreateChargeDtoBillingTiming` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_display_name:** `String` — Display name on invoices
    
</dd>
</dl>

<dl>
<dd>

**min_amount_cents:** `Integer` — Minimum charge in cents
    
</dd>
</dl>

<dl>
<dd>

**prorated:** `Internal::Types::Boolean` 
    
</dd>
</dl>

<dl>
<dd>

**properties:** `Internal::Types::Hash[String, Object]` — Model-specific config. Standard: { amount, currency }. Package: { amount, packageSize, currency }. Percentage: { rate, fixedAmount, freeUnitsPerEvent, freeUnitsPerTotalAggregation }
    
</dd>
</dl>

<dl>
<dd>

**graduated_ranges:** `Internal::Types::Array[Novabilling::Types::GraduatedRangeDto]` — Required for GRADUATED and VOLUME charge models
    
</dd>
</dl>

<dl>
<dd>

**filters:** `Internal::Types::Array[Novabilling::Types::ChargeFilterDto]` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Charges::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/lib/novabilling/charges/client.rb">get</a>(id) -> Novabilling::Types::ChargeResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a charge with its billable metric, graduated ranges, and filters.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.charges.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Charge ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Charges::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/lib/novabilling/charges/client.rb">delete</a>(id) -> Novabilling::Types::ChargeResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove a charge from a plan.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.charges.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Charge ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Charges::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/lib/novabilling/charges/client.rb">update</a>(id, request) -> Novabilling::Types::ChargeResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update charge configuration including pricing, ranges, and filters.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.charges.update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Charge ID
    
</dd>
</dl>

<dl>
<dd>

**billing_timing:** `Novabilling::Charges::Types::UpdateChargeDtoBillingTiming` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_display_name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**min_amount_cents:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**prorated:** `Internal::Types::Boolean` 
    
</dd>
</dl>

<dl>
<dd>

**properties:** `Internal::Types::Hash[String, Object]` 
    
</dd>
</dl>

<dl>
<dd>

**graduated_ranges:** `Internal::Types::Array[Novabilling::Types::GraduatedRangeDto]` 
    
</dd>
</dl>

<dl>
<dd>

**filters:** `Internal::Types::Array[Novabilling::Types::ChargeFilterDto]` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Charges::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/lib/novabilling/charges/client.rb">get_by_plan</a>(plan_id) -> Internal::Types::Array[Novabilling::Types::ChargeResponse]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all charges attached to a specific plan.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.charges.get_by_plan(plan_id: 'planId');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**plan_id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Charges::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Wallets
<details><summary><code>client.wallets.<a href="/lib/novabilling/wallets/client.rb">list</a>() -> Novabilling::Types::PaginatedWalletResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List wallets, optionally filtered by customer or status.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.wallets.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**status:** `Novabilling::Wallets::Types::ListWalletsRequestStatus` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Wallets::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/lib/novabilling/wallets/client.rb">create</a>(request) -> Novabilling::Types::WalletResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a prepaid credit wallet for a customer. Optionally seed it with paid or granted credits.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.wallets.create(
  customer_id: 'cust_abc123',
  currency: 'USD'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**rate_amount:** `Integer` — 1 credit = rateAmount in currency
    
</dd>
</dl>

<dl>
<dd>

**paid_credits:** `Integer` — Paid credits (purchase)
    
</dd>
</dl>

<dl>
<dd>

**granted_credits:** `Integer` — Free credits (grant)
    
</dd>
</dl>

<dl>
<dd>

**expiration_at:** `String` — Expiration date (ISO 8601)
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Internal::Types::Hash[String, Object]` 
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `String` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Wallets::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/lib/novabilling/wallets/client.rb">get</a>(id) -> Novabilling::Types::WalletResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.wallets.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Wallet ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Wallets::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/lib/novabilling/wallets/client.rb">delete</a>(id) -> Novabilling::Types::WalletResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Terminate a wallet. Remaining credits are voided.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.wallets.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Wallet ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Wallets::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/lib/novabilling/wallets/client.rb">update</a>(id, request) -> Novabilling::Types::WalletResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update wallet name, expiration, or metadata.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.wallets.update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Wallet ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**expiration_at:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Internal::Types::Hash[String, Object]` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Wallets::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/lib/novabilling/wallets/client.rb">create_transaction</a>(request) -> Novabilling::Types::TopUpResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add paid/granted credits or void existing credits from a wallet.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.wallets.create_transaction(wallet_id: 'wallet_id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**wallet_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**paid_credits:** `Integer` — Paid credits to purchase
    
</dd>
</dl>

<dl>
<dd>

**granted_credits:** `Integer` — Free credits to grant
    
</dd>
</dl>

<dl>
<dd>

**voided_credits:** `Integer` — Credits to void
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Internal::Types::Hash[String, Object]` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Wallets::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/lib/novabilling/wallets/client.rb">get_transactions</a>(id) -> Novabilling::Types::PaginatedWalletTransactionResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.wallets.get_transactions(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Wallet ID
    
</dd>
</dl>

<dl>
<dd>

**status:** `Novabilling::Wallets::Types::GetTransactionsWalletsRequestStatus` 
    
</dd>
</dl>

<dl>
<dd>

**transaction_status:** `Novabilling::Wallets::Types::GetTransactionsWalletsRequestTransactionStatus` 
    
</dd>
</dl>

<dl>
<dd>

**transaction_type:** `Novabilling::Wallets::Types::GetTransactionsWalletsRequestTransactionType` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Wallets::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## PaymentMethods
<details><summary><code>client.payment_methods.<a href="/lib/novabilling/payment_methods/client.rb">list</a>() -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_methods.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `Novabilling::PaymentMethods::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_methods.<a href="/lib/novabilling/payment_methods/client.rb">create</a>(request) -> Novabilling::Types::PaymentMethodResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_methods.create(
  customer_id: 'cus_abc123',
  provider: 'stripe',
  token_id: 'pm_abc123'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**provider:** `String` — Payment provider (stripe, paystack, flutterwave, dpo, payu, pesapal)
    
</dd>
</dl>

<dl>
<dd>

**type:** `Novabilling::PaymentMethods::Types::CreatePaymentMethodDtoType` 
    
</dd>
</dl>

<dl>
<dd>

**token_id:** `String` — Provider-specific token/payment method ID
    
</dd>
</dl>

<dl>
<dd>

**last4:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**brand:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**exp_month:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**exp_year:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**cardholder_name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**country:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PaymentMethods::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_methods.<a href="/lib/novabilling/payment_methods/client.rb">get_by_customer</a>(customer_id) -> Internal::Types::Array[Novabilling::Types::PaymentMethodResponse]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_methods.get_by_customer(customer_id: 'customerId');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PaymentMethods::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_methods.<a href="/lib/novabilling/payment_methods/client.rb">get</a>(id) -> Novabilling::Types::PaymentMethodResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_methods.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PaymentMethods::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_methods.<a href="/lib/novabilling/payment_methods/client.rb">delete</a>(id) -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_methods.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PaymentMethods::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_methods.<a href="/lib/novabilling/payment_methods/client.rb">set_default</a>(id) -> Novabilling::Types::PaymentMethodResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.payment_methods.set_default(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PaymentMethods::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Taxes
<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">list</a>() -> Novabilling::Types::PaginatedTaxResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**applied_by_default:** `Internal::Types::Boolean` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">create</a>(request) -> Novabilling::Types::TaxResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new tax rate. Set appliedByDefault to automatically apply to all invoices.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.create(
  name: 'VAT',
  code: 'vat_18',
  rate: 18
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**name:** `String` — Tax name
    
</dd>
</dl>

<dl>
<dd>

**code:** `String` — Unique tax code (lowercase, underscores)
    
</dd>
</dl>

<dl>
<dd>

**rate:** `Integer` — Tax rate as a percentage (e.g., 18 for 18%)
    
</dd>
</dl>

<dl>
<dd>

**description:** `String` — Tax description
    
</dd>
</dl>

<dl>
<dd>

**applied_by_default:** `Internal::Types::Boolean` — Whether this tax is applied by default to all invoices
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">get</a>(id) -> Novabilling::Types::TaxResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Tax ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">delete</a>(id) -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Tax ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">update</a>(id, request) -> Novabilling::Types::TaxResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Tax ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**rate:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**applied_by_default:** `Internal::Types::Boolean` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">taxes_controller_get_customer_taxes</a>(customer_id) -> Internal::Types::Array[Novabilling::Types::TaxResponse]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.taxes_controller_get_customer_taxes(customer_id: 'customerId');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">assign_to_customer</a>(customer_id, request) -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.assign_to_customer(
  customer_id: 'customerId',
  tax_id: 'clx1234567890'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `Novabilling::Types::AssignTaxDto` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">remove_from_customer</a>(customer_id, tax_id) -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.remove_from_customer(
  customer_id: 'customerId',
  tax_id: 'taxId'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**tax_id:** `String` — Tax ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">taxes_controller_get_plan_taxes</a>(plan_id) -> Internal::Types::Array[Novabilling::Types::TaxResponse]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.taxes_controller_get_plan_taxes(plan_id: 'planId');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**plan_id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">assign_to_plan</a>(plan_id, request) -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.assign_to_plan(
  plan_id: 'planId',
  tax_id: 'clx1234567890'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**plan_id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `Novabilling::Types::AssignTaxDto` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">remove_from_plan</a>(plan_id, tax_id) -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.remove_from_plan(
  plan_id: 'planId',
  tax_id: 'taxId'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**plan_id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**tax_id:** `String` — Tax ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">assign_to_charge</a>(charge_id, request) -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.assign_to_charge(
  charge_id: 'chargeId',
  tax_id: 'clx1234567890'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**charge_id:** `String` — Charge ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `Novabilling::Types::AssignTaxDto` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/lib/novabilling/taxes/client.rb">remove_from_charge</a>(charge_id, tax_id) -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.taxes.remove_from_charge(
  charge_id: 'chargeId',
  tax_id: 'taxId'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**charge_id:** `String` — Charge ID
    
</dd>
</dl>

<dl>
<dd>

**tax_id:** `String` — Tax ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::Taxes::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## PlanOverrides
<details><summary><code>client.plan_overrides.<a href="/lib/novabilling/plan_overrides/client.rb">list</a>() -> Novabilling::Types::PaginatedPlanOverrideResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all plan overrides, optionally filtered by customerId or planId
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plan_overrides.list();
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**plan_id:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Integer` 
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PlanOverrides::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plan_overrides.<a href="/lib/novabilling/plan_overrides/client.rb">create</a>(request) -> Novabilling::Types::PlanOverrideResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a customer-specific override for a plan (custom pricing, minimum commitment, or charge properties)
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plan_overrides.create(
  customer_id: 'clx_customer_123',
  plan_id: 'clx_plan_456'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customer_id:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**plan_id:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**overridden_prices:** `Internal::Types::Array[String]` — Override plan prices: array of { currency, amount }
    
</dd>
</dl>

<dl>
<dd>

**overridden_minimum_commitment:** `Integer` — Override minimum commitment amount
    
</dd>
</dl>

<dl>
<dd>

**overridden_charges:** `Internal::Types::Array[String]` — Override charge properties: array of { chargeId, properties?, graduatedRanges? }
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Internal::Types::Hash[String, Object]` — Custom metadata
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PlanOverrides::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plan_overrides.<a href="/lib/novabilling/plan_overrides/client.rb">get</a>(id) -> Novabilling::Types::PlanOverrideResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plan_overrides.get(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Plan override ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PlanOverrides::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plan_overrides.<a href="/lib/novabilling/plan_overrides/client.rb">delete</a>(id) -> </code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plan_overrides.delete(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Plan override ID
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PlanOverrides::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plan_overrides.<a href="/lib/novabilling/plan_overrides/client.rb">update</a>(id, request) -> Novabilling::Types::PlanOverrideResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```ruby
client.plan_overrides.update(id: 'id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `String` — Plan override ID
    
</dd>
</dl>

<dl>
<dd>

**overridden_prices:** `Internal::Types::Array[String]` — Override plan prices
    
</dd>
</dl>

<dl>
<dd>

**overridden_minimum_commitment:** `Integer` — Override minimum commitment amount
    
</dd>
</dl>

<dl>
<dd>

**overridden_charges:** `Internal::Types::Array[String]` — Override charge properties
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Internal::Types::Hash[String, Object]` — Custom metadata
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `Novabilling::PlanOverrides::RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>
