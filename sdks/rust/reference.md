# Reference
## Auth
<details><summary><code>client.auth.<a href="/src/api/resources/auth/client.rs">register</a>(request: RegisterDto) -> Result&lt;RegisterResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .auth
        .register(
            &RegisterDto {
                name: "John Doe".to_string(),
                email: "john@company.com".to_string(),
                password: "securePassword123".to_string(),
                company_name: "Acme Corp".to_string(),
            },
            None,
        )
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/src/api/resources/auth/client.rs">login</a>(request: LoginDto) -> Result&lt;LoginResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .auth
        .login(
            &LoginDto {
                email: "john@company.com".to_string(),
                password: "securePassword123".to_string(),
            },
            None,
        )
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/src/api/resources/auth/client.rs">refresh_token</a>(request: RefreshTokenDto) -> Result&lt;TokenPairResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .auth
        .refresh_token(
            &RefreshTokenDto {
                refresh_token: "refreshToken".to_string(),
            },
            None,
        )
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/src/api/resources/auth/client.rs">forgot_password</a>(request: ForgotPasswordDto) -> Result&lt;MessageResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .auth
        .forgot_password(
            &ForgotPasswordDto {
                email: "john@company.com".to_string(),
            },
            None,
        )
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/src/api/resources/auth/client.rs">reset_password</a>(request: ResetPasswordDto) -> Result&lt;MessageResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .auth
        .reset_password(
            &ResetPasswordDto {
                token: "token".to_string(),
                new_password: "newSecurePassword123".to_string(),
            },
            None,
        )
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## Tenants
<details><summary><code>client.tenants.<a href="/src/api/resources/tenants/client.rs">get_me</a>() -> Result&lt;TenantResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.tenants.get_me(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.tenants.<a href="/src/api/resources/tenants/client.rs">update_me</a>(request: UpdateTenantDto) -> Result&lt;TenantResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .tenants
        .update_me(
            &UpdateTenantDto {
                name: None,
                email: None,
                webhook_url: None,
                settings: None,
            },
            None,
        )
        .await;
}
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

**name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**email:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**webhook_url:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**settings:** `Option<std::collections::HashMap<String, serde_json::Value>>` — Custom tenant settings (merged with existing)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.tenants.<a href="/src/api/resources/tenants/client.rs">get_usage</a>() -> Result&lt;TenantUsageResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.tenants.get_usage(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.tenants.<a href="/src/api/resources/tenants/client.rs">test_smtp</a>(request: TestSMTPTenantsRequest) -> Result&lt;MessageResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .tenants
        .test_smtp(
            &TestSMTPTenantsRequest {
                to: "test@example.com".to_string(),
            },
            None,
        )
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## APIKeys
<details><summary><code>client.api_keys.<a href="/src/api/resources/api_keys/client.rs">list</a>() -> Result&lt;Vec&lt;APIKeyResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.api_keys.list(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.api_keys.<a href="/src/api/resources/api_keys/client.rs">create</a>(request: CreateAPIKeyBodyDto) -> Result&lt;APIKeyResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .api_keys
        .create(
            &CreateAPIKeyBodyDto {
                name: "Production API Key".to_string(),
                scopes: vec!["read".to_string(), "write".to_string()],
                expires_at: None,
            },
            None,
        )
        .await;
}
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

**scopes:** `Vec<String>` 
    
</dd>
</dl>

<dl>
<dd>

**expires_at:** `Option<String>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.api_keys.<a href="/src/api/resources/api_keys/client.rs">delete</a>(id: String) -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.api_keys.delete(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## Currencies
<details><summary><code>client.currencies.<a href="/src/api/resources/currencies/client.rs">list</a>() -> Result&lt;Vec&lt;CurrencyResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.currencies.list(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Customers
<details><summary><code>client.customers.<a href="/src/api/resources/customers/client.rs">list</a>(page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;, search: Option&lt;Option&lt;String&gt;&gt;, country: Option&lt;Option&lt;String&gt;&gt;, currency: Option&lt;Option&lt;String&gt;&gt;, sort_by: Option&lt;Option&lt;String&gt;&gt;, sort_order: Option&lt;Option&lt;ListCustomersRequestSortOrder&gt;&gt;) -> Result&lt;PaginatedCustomerResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .customers
        .list(
            &ListQueryRequest12 {
                page: None,
                limit: None,
                search: None,
                country: None,
                currency: None,
                sort_by: None,
                sort_order: None,
            },
            None,
        )
        .await;
}
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

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**search:** `Option<String>` — Search by name or email
    
</dd>
</dl>

<dl>
<dd>

**country:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**sort_by:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**sort_order:** `Option<ListCustomersRequestSortOrder>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client.rs">create</a>(request: CreateCustomerDto) -> Result&lt;CustomerResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .customers
        .create(
            &CreateCustomerDto {
                external_id: "user_12345".to_string(),
                email: "customer@example.com".to_string(),
                currency: "NGN".to_string(),
                name: None,
                country: None,
                metadata: None,
                net_payment_terms: None,
                created_at: None,
            },
            None,
        )
        .await;
}
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

**name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**country:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — ISO currency code
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Option<std::collections::HashMap<String, serde_json::Value>>` — Custom metadata
    
</dd>
</dl>

<dl>
<dd>

**net_payment_terms:** `Option<f64>` — Net payment terms in days (overrides org and plan defaults)
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `Option<String>` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client.rs">get</a>(id: String) -> Result&lt;CustomerResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.customers.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client.rs">delete</a>(id: String) -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.customers.delete(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client.rs">update</a>(id: String, request: UpdateCustomerDto) -> Result&lt;CustomerResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .customers
        .update(
            &"id".to_string(),
            &UpdateCustomerDto {
                external_id: None,
                email: None,
                name: None,
                country: None,
                currency: None,
                metadata: None,
                net_payment_terms: None,
                created_at: None,
            },
            None,
        )
        .await;
}
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

**external_id:** `Option<String>` — Tenant's user ID
    
</dd>
</dl>

<dl>
<dd>

**email:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**country:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `Option<String>` — ISO currency code
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Option<std::collections::HashMap<String, serde_json::Value>>` — Custom metadata
    
</dd>
</dl>

<dl>
<dd>

**net_payment_terms:** `Option<f64>` — Net payment terms in days (overrides org and plan defaults)
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `Option<String>` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client.rs">get_subscriptions</a>(id: String) -> Result&lt;Vec&lt;SubscriptionResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .customers
        .get_subscriptions(&"id".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client.rs">get_invoices</a>(id: String) -> Result&lt;Vec&lt;InvoiceResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.customers.get_invoices(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client.rs">get_payments</a>(id: String) -> Result&lt;Vec&lt;PaymentResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.customers.get_payments(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client.rs">get_payment_methods</a>(id: String) -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .customers
        .get_payment_methods(&"id".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client.rs">add_payment_method</a>(id: String) -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .customers
        .add_payment_method(&"id".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client.rs">delete_payment_method</a>(id: String, method_id: String) -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .customers
        .delete_payment_method(&"id".to_string(), &"methodId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## Plans
<details><summary><code>client.plans.<a href="/src/api/resources/plans/client.rs">list</a>(is_active: Option&lt;Option&lt;bool&gt;&gt;) -> Result&lt;Vec&lt;PlanResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .plans
        .list(&ListQueryRequest12 { is_active: None }, None)
        .await;
}
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

**is_active:** `Option<bool>` — Filter by active status
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client.rs">create</a>(request: CreatePlanDto) -> Result&lt;PlanResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .plans
        .create(
            &CreatePlanDto {
                name: "Premium Monthly".to_string(),
                code: "premium_monthly".to_string(),
                billing_interval: CreatePlanDtoBillingInterval::Hourly,
                description: None,
                billing_timing: None,
                features: None,
                prices: None,
                net_payment_terms: None,
                invoice_grace_period_days: None,
                progressive_billing_threshold: None,
            },
            None,
        )
        .await;
}
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

**description:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**billing_interval:** `CreatePlanDtoBillingInterval` 
    
</dd>
</dl>

<dl>
<dd>

**billing_timing:** `Option<CreatePlanDtoBillingTiming>` — When to charge: IN_ADVANCE (at period start) or IN_ARREARS (at period end). Defaults to IN_ARREARS.
    
</dd>
</dl>

<dl>
<dd>

**features:** `Option<Vec<String>>` 
    
</dd>
</dl>

<dl>
<dd>

**prices:** `Option<Vec<CreatePlanPriceDto>>` 
    
</dd>
</dl>

<dl>
<dd>

**net_payment_terms:** `Option<f64>` — Net payment terms in days (overrides org default)
    
</dd>
</dl>

<dl>
<dd>

**invoice_grace_period_days:** `Option<f64>` — Grace period in days before draft invoices are finalized
    
</dd>
</dl>

<dl>
<dd>

**progressive_billing_threshold:** `Option<f64>` — Usage cost threshold for mid-cycle progressive billing invoices
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client.rs">get</a>(id: String) -> Result&lt;PlanResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.plans.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client.rs">delete</a>(id: String) -> Result&lt;PlanResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.plans.delete(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client.rs">update</a>(id: String, request: UpdatePlanDto) -> Result&lt;PlanResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .plans
        .update(
            &"id".to_string(),
            &UpdatePlanDto {
                name: None,
                description: None,
                billing_interval: None,
                billing_timing: None,
                features: None,
                is_active: None,
                net_payment_terms: None,
                invoice_grace_period_days: None,
                progressive_billing_threshold: None,
            },
            None,
        )
        .await;
}
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

**name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**billing_interval:** `Option<UpdatePlanDtoBillingInterval>` 
    
</dd>
</dl>

<dl>
<dd>

**billing_timing:** `Option<UpdatePlanDtoBillingTiming>` — When to charge: IN_ADVANCE or IN_ARREARS
    
</dd>
</dl>

<dl>
<dd>

**features:** `Option<Vec<String>>` 
    
</dd>
</dl>

<dl>
<dd>

**is_active:** `Option<bool>` 
    
</dd>
</dl>

<dl>
<dd>

**net_payment_terms:** `Option<f64>` — Net payment terms in days
    
</dd>
</dl>

<dl>
<dd>

**invoice_grace_period_days:** `Option<f64>` — Grace period in days before draft invoices are finalized
    
</dd>
</dl>

<dl>
<dd>

**progressive_billing_threshold:** `Option<f64>` — Usage cost threshold for progressive billing
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client.rs">add_price</a>(id: String, request: CreatePlanPriceDto) -> Result&lt;PlanPriceResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .plans
        .add_price(
            &"id".to_string(),
            &CreatePlanPriceDto {
                currency: "NGN".to_string(),
                amount: 9999.99,
            },
            None,
        )
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client.rs">delete_price</a>(id: String, price_id: String) -> Result&lt;PlanPriceResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .plans
        .delete_price(&"id".to_string(), &"priceId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client.rs">update_price</a>(id: String, price_id: String) -> Result&lt;PlanPriceResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .plans
        .update_price(&"id".to_string(), &"priceId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## Subscriptions
<details><summary><code>client.subscriptions.<a href="/src/api/resources/subscriptions/client.rs">list</a>(status: Option&lt;Option&lt;String&gt;&gt;, customer_id: Option&lt;Option&lt;String&gt;&gt;, plan_id: Option&lt;Option&lt;String&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedSubscriptionResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .subscriptions
        .list(
            &ListQueryRequest12 {
                status: None,
                customer_id: None,
                plan_id: None,
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**status:** `Option<String>` — Filter by status (ACTIVE, TRIALING, PAUSED, CANCELED)
    
</dd>
</dl>

<dl>
<dd>

**customer_id:** `Option<String>` — Filter by customer ID
    
</dd>
</dl>

<dl>
<dd>

**plan_id:** `Option<String>` — Filter by plan ID
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/src/api/resources/subscriptions/client.rs">create</a>(request: CreateSubscriptionDto) -> Result&lt;SubscriptionResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .subscriptions
        .create(
            &CreateSubscriptionDto {
                customer_id: "customerId".to_string(),
                plan_id: "planId".to_string(),
                currency: "NGN".to_string(),
                trial_days: None,
                metadata: None,
                start_date: None,
                current_period_end: None,
                status: None,
                created_at: None,
                external_id: None,
                canceled_at: None,
            },
            None,
        )
        .await;
}
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

**trial_days:** `Option<f64>` — Number of trial days
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Option<std::collections::HashMap<String, serde_json::Value>>` 
    
</dd>
</dl>

<dl>
<dd>

**start_date:** `Option<String>` — Override subscription start date (ISO 8601). Defaults to now.
    
</dd>
</dl>

<dl>
<dd>

**current_period_end:** `Option<String>` — Override current period end (ISO 8601). Defaults to calculated from startDate + billing interval.
    
</dd>
</dl>

<dl>
<dd>

**status:** `Option<CreateSubscriptionDtoStatus>` — Override subscription status for imports
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `Option<String>` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>

<dl>
<dd>

**external_id:** `Option<String>` — External ID for linking to external systems
    
</dd>
</dl>

<dl>
<dd>

**canceled_at:** `Option<String>` — Canceled at date (ISO 8601). For importing canceled subscriptions.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/src/api/resources/subscriptions/client.rs">get</a>(id: String) -> Result&lt;SubscriptionResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.subscriptions.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/src/api/resources/subscriptions/client.rs">update</a>(id: String, request: UpdateSubscriptionDto) -> Result&lt;SubscriptionResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .subscriptions
        .update(
            &"id".to_string(),
            &UpdateSubscriptionDto { metadata: None },
            None,
        )
        .await;
}
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

**metadata:** `Option<std::collections::HashMap<String, serde_json::Value>>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/src/api/resources/subscriptions/client.rs">cancel</a>(id: String, request: CancelSubscriptionDto) -> Result&lt;SubscriptionResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .subscriptions
        .cancel(
            &"id".to_string(),
            &CancelSubscriptionDto {
                cancel_at: CancelSubscriptionDtoCancelAt::Now,
            },
            None,
        )
        .await;
}
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

**cancel_at:** `CancelSubscriptionDtoCancelAt` — When to cancel: immediately or at end of current period
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/src/api/resources/subscriptions/client.rs">pause</a>(id: String) -> Result&lt;SubscriptionResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.subscriptions.pause(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/src/api/resources/subscriptions/client.rs">resume</a>(id: String) -> Result&lt;SubscriptionResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.subscriptions.resume(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/src/api/resources/subscriptions/client.rs">change_plan</a>(id: String, request: ChangePlanDto) -> Result&lt;SubscriptionResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .subscriptions
        .change_plan(
            &"id".to_string(),
            &ChangePlanDto {
                new_plan_id: "newPlanId".to_string(),
                prorate: None,
            },
            None,
        )
        .await;
}
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

**prorate:** `Option<bool>` — Whether to prorate charges
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Invoices
<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client.rs">list</a>(status: Option&lt;Option&lt;String&gt;&gt;, customer_id: Option&lt;Option&lt;String&gt;&gt;, date_from: Option&lt;Option&lt;String&gt;&gt;, date_to: Option&lt;Option&lt;String&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedInvoiceResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .invoices
        .list(
            &ListQueryRequest12 {
                status: None,
                customer_id: None,
                date_from: None,
                date_to: None,
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**status:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**customer_id:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**date_from:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client.rs">create</a>(request: CreateInvoiceDto) -> Result&lt;InvoiceResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .invoices
        .create(
            &CreateInvoiceDto {
                customer_id: "customerId".to_string(),
                items: vec![InvoiceItemDto {
                    description: "Premium Monthly Plan".to_string(),
                    quantity: 1.0,
                    unit_amount: 9999.99,
                }],
                due_date: "2025-02-15".to_string(),
                subscription_id: None,
                status: None,
                invoice_number: None,
                currency: None,
                paid_at: None,
                created_at: None,
            },
            None,
        )
        .await;
}
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

**subscription_id:** `Option<String>` — Subscription ID (optional)
    
</dd>
</dl>

<dl>
<dd>

**items:** `Vec<InvoiceItemDto>` 
    
</dd>
</dl>

<dl>
<dd>

**due_date:** `String` — Due date
    
</dd>
</dl>

<dl>
<dd>

**status:** `Option<CreateInvoiceDtoStatus>` — Override invoice status for imports
    
</dd>
</dl>

<dl>
<dd>

**invoice_number:** `Option<String>` — Override invoice number (e.g. INV-00042). Auto-generated if omitted.
    
</dd>
</dl>

<dl>
<dd>

**currency:** `Option<String>` — Currency override (defaults to customer currency)
    
</dd>
</dl>

<dl>
<dd>

**paid_at:** `Option<String>` — Paid at date (ISO 8601). For importing paid invoices.
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `Option<String>` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client.rs">get</a>(id: String) -> Result&lt;InvoiceResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.invoices.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client.rs">finalize</a>(id: String) -> Result&lt;InvoiceResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.invoices.finalize(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client.rs">void</a>(id: String) -> Result&lt;InvoiceResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.invoices.void(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client.rs">mark_paid</a>(id: String, request: MarkPaidInvoicesRequest) -> Result&lt;InvoiceResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .invoices
        .mark_paid(
            &"id".to_string(),
            &MarkPaidInvoicesRequest {
                payment_method: None,
            },
            None,
        )
        .await;
}
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

**payment_method:** `Option<String>` — Payment method used (cash, bank_transfer, check, manual). Defaults to "manual".
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client.rs">create_checkout</a>(id: String, request: CreateCheckoutInvoicesRequest) -> Result&lt;CheckoutResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .invoices
        .create_checkout(
            &"id".to_string(),
            &CreateCheckoutInvoicesRequest { callback_url: None },
            None,
        )
        .await;
}
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

**callback_url:** `Option<String>` — URL to redirect customer after payment
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client.rs">send_email</a>(id: String, request: SendEmailInvoicesRequest) -> Result&lt;MessageResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .invoices
        .send_email(
            &"id".to_string(),
            &SendEmailInvoicesRequest { email: None },
            None,
        )
        .await;
}
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

**email:** `Option<String>` — Recipient email address. Defaults to the customer email if omitted.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client.rs">get_pdf</a>(id: String) -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.invoices.get_pdf(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## Payments
<details><summary><code>client.payments.<a href="/src/api/resources/payments/client.rs">list</a>(status: Option&lt;Option&lt;String&gt;&gt;, provider: Option&lt;Option&lt;String&gt;&gt;, invoice_id: Option&lt;Option&lt;String&gt;&gt;, date_from: Option&lt;Option&lt;String&gt;&gt;, date_to: Option&lt;Option&lt;String&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedPaymentResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .payments
        .list(
            &ListQueryRequest12 {
                status: None,
                provider: None,
                invoice_id: None,
                date_from: None,
                date_to: None,
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**status:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**provider:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_id:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**date_from:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payments.<a href="/src/api/resources/payments/client.rs">payments_controller_create</a>(request: CreatePaymentDto) -> Result&lt;PaymentResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .payments
        .payments_controller_create(
            &CreatePaymentDto {
                invoice_id: "invoiceId".to_string(),
                provider: "manual".to_string(),
                amount: 49.99,
                currency: "USD".to_string(),
                status: CreatePaymentDtoStatus::Processing,
                provider_transaction_id: None,
                failure_reason: None,
                created_at: None,
            },
            None,
        )
        .await;
}
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

**amount:** `f64` — Payment amount
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — Currency
    
</dd>
</dl>

<dl>
<dd>

**status:** `CreatePaymentDtoStatus` — Payment status
    
</dd>
</dl>

<dl>
<dd>

**provider_transaction_id:** `Option<String>` — Provider transaction ID
    
</dd>
</dl>

<dl>
<dd>

**failure_reason:** `Option<String>` — Failure reason (for FAILED payments)
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `Option<String>` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payments.<a href="/src/api/resources/payments/client.rs">get</a>(id: String) -> Result&lt;PaymentResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.payments.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payments.<a href="/src/api/resources/payments/client.rs">refund</a>(id: String, request: RefundPaymentDto) -> Result&lt;PaymentResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .payments
        .refund(
            &"id".to_string(),
            &RefundPaymentDto {
                amount: None,
                reason: None,
            },
            None,
        )
        .await;
}
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

**amount:** `Option<f64>` — Amount to refund (full refund if omitted)
    
</dd>
</dl>

<dl>
<dd>

**reason:** `Option<String>` — Reason for refund
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Payment Providers
<details><summary><code>client.payment_providers.<a href="/src/api/resources/payment_providers/client.rs">list</a>() -> Result&lt;Vec&lt;PaymentProviderResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.payment_providers.list(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_providers.<a href="/src/api/resources/payment_providers/client.rs">configure</a>(request: CreateProviderDto) -> Result&lt;PaymentProviderResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .payment_providers
        .configure(
            &CreateProviderDto {
                provider_name: "flutterwave".to_string(),
                credentials: HashMap::from([("key".to_string(), serde_json::json!("value"))]),
                is_active: None,
                priority: None,
            },
            None,
        )
        .await;
}
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

**credentials:** `std::collections::HashMap<String, serde_json::Value>` — Provider credentials (will be encrypted)
    
</dd>
</dl>

<dl>
<dd>

**is_active:** `Option<bool>` 
    
</dd>
</dl>

<dl>
<dd>

**priority:** `Option<f64>` — Priority (lower = higher)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_providers.<a href="/src/api/resources/payment_providers/client.rs">get</a>(id: String) -> Result&lt;PaymentProviderResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.payment_providers.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_providers.<a href="/src/api/resources/payment_providers/client.rs">delete</a>(id: String) -> Result&lt;PaymentProviderResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .payment_providers
        .delete(&"id".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_providers.<a href="/src/api/resources/payment_providers/client.rs">update</a>(id: String, request: UpdateProviderDto) -> Result&lt;PaymentProviderResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .payment_providers
        .update(
            &"id".to_string(),
            &UpdateProviderDto {
                provider_name: None,
                credentials: None,
                is_active: None,
                priority: None,
            },
            None,
        )
        .await;
}
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

**provider_name:** `Option<String>` — Provider name
    
</dd>
</dl>

<dl>
<dd>

**credentials:** `Option<std::collections::HashMap<String, serde_json::Value>>` — Provider credentials (will be encrypted)
    
</dd>
</dl>

<dl>
<dd>

**is_active:** `Option<bool>` 
    
</dd>
</dl>

<dl>
<dd>

**priority:** `Option<f64>` — Priority (lower = higher)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_providers.<a href="/src/api/resources/payment_providers/client.rs">test_connection</a>(id: String) -> Result&lt;ProviderTestResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .payment_providers
        .test_connection(&"id".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## Webhooks
<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client.rs">webhooks_controller_paystack</a>() -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .webhooks
        .webhooks_controller_paystack(Some(
            RequestOptions::new().additional_header("x-paystack-signature", "x-paystack-signature"),
        ))
        .await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client.rs">webhooks_controller_flutterwave</a>() -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.webhooks.webhooks_controller_flutterwave(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client.rs">webhooks_controller_dpo</a>() -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.webhooks.webhooks_controller_dpo(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client.rs">webhooks_controller_payu</a>() -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.webhooks.webhooks_controller_payu(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client.rs">webhooks_controller_pesapal</a>() -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.webhooks.webhooks_controller_pesapal(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client.rs">webhooks_controller_stripe</a>() -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .webhooks
        .webhooks_controller_stripe(Some(
            RequestOptions::new().additional_header("stripe-signature", "stripe-signature"),
        ))
        .await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Analytics
<details><summary><code>client.analytics.<a href="/src/api/resources/analytics/client.rs">get_revenue</a>(date_from: Option&lt;Option&lt;String&gt;&gt;, date_to: Option&lt;Option&lt;String&gt;&gt;, currency: Option&lt;Option&lt;String&gt;&gt;, group_by: Option&lt;Option&lt;GetRevenueAnalyticsRequestGroupBy&gt;&gt;) -> Result&lt;RevenueAnalyticsResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .analytics
        .get_revenue(
            &GetRevenueQueryRequest {
                date_from: Some("2025-01-01".to_string()),
                date_to: Some("2025-12-31".to_string()),
                currency: None,
                group_by: None,
            },
            None,
        )
        .await;
}
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

**date_from:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Option<GetRevenueAnalyticsRequestGroupBy>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/src/api/resources/analytics/client.rs">get_subscriptions</a>(date_from: Option&lt;Option&lt;String&gt;&gt;, date_to: Option&lt;Option&lt;String&gt;&gt;, currency: Option&lt;Option&lt;String&gt;&gt;, group_by: Option&lt;Option&lt;GetSubscriptionsAnalyticsRequestGroupBy&gt;&gt;) -> Result&lt;SubscriptionAnalyticsResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .analytics
        .get_subscriptions(
            &GetSubscriptionsQueryRequest {
                date_from: Some("2025-01-01".to_string()),
                date_to: Some("2025-12-31".to_string()),
                currency: None,
                group_by: None,
            },
            None,
        )
        .await;
}
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

**date_from:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Option<GetSubscriptionsAnalyticsRequestGroupBy>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/src/api/resources/analytics/client.rs">get_customers</a>(date_from: Option&lt;Option&lt;String&gt;&gt;, date_to: Option&lt;Option&lt;String&gt;&gt;, currency: Option&lt;Option&lt;String&gt;&gt;, group_by: Option&lt;Option&lt;GetCustomersAnalyticsRequestGroupBy&gt;&gt;) -> Result&lt;CustomerAnalyticsResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .analytics
        .get_customers(
            &GetCustomersQueryRequest {
                date_from: Some("2025-01-01".to_string()),
                date_to: Some("2025-12-31".to_string()),
                currency: None,
                group_by: None,
            },
            None,
        )
        .await;
}
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

**date_from:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Option<GetCustomersAnalyticsRequestGroupBy>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/src/api/resources/analytics/client.rs">get_payments</a>(date_from: Option&lt;Option&lt;String&gt;&gt;, date_to: Option&lt;Option&lt;String&gt;&gt;, currency: Option&lt;Option&lt;String&gt;&gt;, group_by: Option&lt;Option&lt;GetPaymentsAnalyticsRequestGroupBy&gt;&gt;, provider: Option&lt;Option&lt;String&gt;&gt;) -> Result&lt;PaymentAnalyticsResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .analytics
        .get_payments(
            &GetPaymentsQueryRequest2 {
                date_from: Some("2025-01-01".to_string()),
                date_to: Some("2025-12-31".to_string()),
                currency: None,
                group_by: None,
                provider: None,
            },
            None,
        )
        .await;
}
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

**date_from:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Option<GetPaymentsAnalyticsRequestGroupBy>` 
    
</dd>
</dl>

<dl>
<dd>

**provider:** `Option<String>` — Filter by payment provider name
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/src/api/resources/analytics/client.rs">get_mrr_breakdown</a>(date_from: Option&lt;Option&lt;String&gt;&gt;, date_to: Option&lt;Option&lt;String&gt;&gt;, currency: Option&lt;Option&lt;String&gt;&gt;, group_by: Option&lt;Option&lt;GetMrrBreakdownAnalyticsRequestGroupBy&gt;&gt;) -> Result&lt;MrrBreakdownResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .analytics
        .get_mrr_breakdown(
            &GetMrrBreakdownQueryRequest {
                date_from: Some("2025-01-01".to_string()),
                date_to: Some("2025-12-31".to_string()),
                currency: None,
                group_by: None,
            },
            None,
        )
        .await;
}
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

**date_from:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Option<GetMrrBreakdownAnalyticsRequestGroupBy>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/src/api/resources/analytics/client.rs">get_net_revenue</a>(date_from: Option&lt;Option&lt;String&gt;&gt;, date_to: Option&lt;Option&lt;String&gt;&gt;, currency: Option&lt;Option&lt;String&gt;&gt;, group_by: Option&lt;Option&lt;GetNetRevenueAnalyticsRequestGroupBy&gt;&gt;) -> Result&lt;NetRevenueResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .analytics
        .get_net_revenue(
            &GetNetRevenueQueryRequest {
                date_from: Some("2025-01-01".to_string()),
                date_to: Some("2025-12-31".to_string()),
                currency: None,
                group_by: None,
            },
            None,
        )
        .await;
}
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

**date_from:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**date_to:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**group_by:** `Option<GetNetRevenueAnalyticsRequestGroupBy>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/src/api/resources/analytics/client.rs">get_churn_cohorts</a>(months: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;ChurnCohortsResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .analytics
        .get_churn_cohorts(&GetChurnCohortsQueryRequest { months: None }, None)
        .await;
}
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

**months:** `Option<f64>` — Number of months to analyze (default 12)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/src/api/resources/analytics/client.rs">get_lifetime_value</a>() -> Result&lt;LtvResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.analytics.get_lifetime_value(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Coupons
<details><summary><code>client.coupons.<a href="/src/api/resources/coupons/client.rs">list</a>(is_active: Option&lt;Option&lt;bool&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedCouponResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .coupons
        .list(
            &ListQueryRequest12 {
                is_active: None,
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**is_active:** `Option<bool>` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/src/api/resources/coupons/client.rs">create</a>(request: CreateCouponDto) -> Result&lt;CouponResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .coupons
        .create(
            &CreateCouponDto {
                code: "WELCOME20".to_string(),
                name: "20% Welcome Discount".to_string(),
                discount_type: CreateCouponDtoDiscountType::Percentage,
                discount_value: 20.0,
                description: None,
                currency: None,
                max_redemptions: None,
                applies_to_plan_ids: None,
                expires_at: None,
                created_at: None,
            },
            None,
        )
        .await;
}
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

**description:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**discount_type:** `CreateCouponDtoDiscountType` 
    
</dd>
</dl>

<dl>
<dd>

**discount_value:** `f64` — Discount value (percentage 0-100 or fixed amount)
    
</dd>
</dl>

<dl>
<dd>

**currency:** `Option<String>` — Currency for FIXED_AMOUNT discounts
    
</dd>
</dl>

<dl>
<dd>

**max_redemptions:** `Option<f64>` — Max number of redemptions (null = unlimited)
    
</dd>
</dl>

<dl>
<dd>

**applies_to_plan_ids:** `Option<Vec<String>>` — Plan IDs this coupon applies to (empty = all)
    
</dd>
</dl>

<dl>
<dd>

**expires_at:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `Option<String>` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/src/api/resources/coupons/client.rs">get</a>(id: String) -> Result&lt;CouponResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.coupons.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/src/api/resources/coupons/client.rs">delete</a>(id: String) -> Result&lt;CouponResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.coupons.delete(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/src/api/resources/coupons/client.rs">update</a>(id: String, request: UpdateCouponDto) -> Result&lt;CouponResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .coupons
        .update(
            &"id".to_string(),
            &UpdateCouponDto {
                name: None,
                description: None,
                is_active: None,
                expires_at: None,
            },
            None,
        )
        .await;
}
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

**name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**is_active:** `Option<bool>` 
    
</dd>
</dl>

<dl>
<dd>

**expires_at:** `Option<String>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/src/api/resources/coupons/client.rs">apply</a>(request: ApplyCouponDto) -> Result&lt;AppliedCouponResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .coupons
        .apply(
            &ApplyCouponDto {
                coupon_id: "couponId".to_string(),
                customer_id: "customerId".to_string(),
                subscription_id: None,
                uses_remaining: None,
            },
            None,
        )
        .await;
}
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

**subscription_id:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**uses_remaining:** `Option<f64>` — Number of billing cycles to apply (null = forever)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/src/api/resources/coupons/client.rs">remove_applied</a>(id: String) -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.coupons.remove_applied(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## AddOns
<details><summary><code>client.add_ons.<a href="/src/api/resources/add_ons/client.rs">list</a>(page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedAddOnResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .add_ons
        .list(
            &ListQueryRequest12 {
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/src/api/resources/add_ons/client.rs">create</a>(request: CreateAddOnDto) -> Result&lt;AddOnResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .add_ons
        .create(
            &CreateAddOnDto {
                name: "Premium Support".to_string(),
                code: "premium_support".to_string(),
                prices: vec![AddOnPriceDto {
                    currency: "UGX".to_string(),
                    amount: 50000.0,
                }],
                description: None,
                invoice_display_name: None,
                created_at: None,
            },
            None,
        )
        .await;
}
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

**description:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_display_name:** `Option<String>` — Custom name shown on invoices
    
</dd>
</dl>

<dl>
<dd>

**prices:** `Vec<AddOnPriceDto>` — Prices in different currencies
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `Option<String>` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/src/api/resources/add_ons/client.rs">get</a>(id: String) -> Result&lt;AddOnResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.add_ons.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/src/api/resources/add_ons/client.rs">delete</a>(id: String) -> Result&lt;AddOnResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.add_ons.delete(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/src/api/resources/add_ons/client.rs">update</a>(id: String, request: UpdateAddOnDto) -> Result&lt;AddOnResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .add_ons
        .update(
            &"id".to_string(),
            &UpdateAddOnDto {
                name: None,
                description: None,
                invoice_display_name: None,
                prices: None,
            },
            None,
        )
        .await;
}
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

**name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_display_name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**prices:** `Option<Vec<AddOnPriceDto>>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/src/api/resources/add_ons/client.rs">apply</a>(request: ApplyAddOnDto) -> Result&lt;AppliedAddOnResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .add_ons
        .apply(
            &ApplyAddOnDto {
                add_on_id: "addOnId".to_string(),
                customer_id: "customerId".to_string(),
                amount: 50000.0,
                currency: "UGX".to_string(),
                subscription_id: None,
            },
            None,
        )
        .await;
}
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

**subscription_id:** `Option<String>` — Subscription to attach the charge to
    
</dd>
</dl>

<dl>
<dd>

**amount:** `f64` — Charge amount
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — Currency
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/src/api/resources/add_ons/client.rs">list_applied</a>(customer_id: Option&lt;Option&lt;String&gt;&gt;, invoiced: Option&lt;Option&lt;bool&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;Vec&lt;AppliedAddOnResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .add_ons
        .list_applied(
            &ListAppliedQueryRequest {
                customer_id: None,
                invoiced: None,
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**customer_id:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**invoiced:** `Option<bool>` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.add_ons.<a href="/src/api/resources/add_ons/client.rs">remove_applied</a>(id: String) -> Result&lt;AppliedAddOnResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.add_ons.remove_applied(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## CreditNotes
<details><summary><code>client.credit_notes.<a href="/src/api/resources/credit_notes/client.rs">list</a>(customer_id: Option&lt;Option&lt;String&gt;&gt;, invoice_id: Option&lt;Option&lt;String&gt;&gt;, status: Option&lt;Option&lt;ListCreditNotesRequestStatus&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedCreditNoteResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .credit_notes
        .list(
            &ListQueryRequest12 {
                customer_id: None,
                invoice_id: None,
                status: None,
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**customer_id:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_id:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**status:** `Option<ListCreditNotesRequestStatus>` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credit_notes.<a href="/src/api/resources/credit_notes/client.rs">create</a>(request: CreateCreditNoteDto) -> Result&lt;CreditNoteResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .credit_notes
        .create(
            &CreateCreditNoteDto {
                invoice_id: "invoiceId".to_string(),
                customer_id: "customerId".to_string(),
                amount: 25000.0,
                currency: "UGX".to_string(),
                reason: CreateCreditNoteDtoReason::Duplicate,
                metadata: None,
                status: None,
                created_at: None,
            },
            None,
        )
        .await;
}
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

**amount:** `f64` — Credit amount
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` — Currency
    
</dd>
</dl>

<dl>
<dd>

**reason:** `CreateCreditNoteDtoReason` 
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Option<std::collections::HashMap<String, serde_json::Value>>` — Additional metadata
    
</dd>
</dl>

<dl>
<dd>

**status:** `Option<CreateCreditNoteDtoStatus>` — Override status for imports
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `Option<String>` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credit_notes.<a href="/src/api/resources/credit_notes/client.rs">get</a>(id: String) -> Result&lt;CreditNoteResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.credit_notes.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credit_notes.<a href="/src/api/resources/credit_notes/client.rs">credit_notes_controller_update</a>(id: String, request: UpdateCreditNoteDto) -> Result&lt;CreditNoteResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .credit_notes
        .credit_notes_controller_update(
            &"id".to_string(),
            &UpdateCreditNoteDto {
                amount: None,
                reason: None,
                metadata: None,
            },
            None,
        )
        .await;
}
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

**amount:** `Option<f64>` — Updated amount
    
</dd>
</dl>

<dl>
<dd>

**reason:** `Option<UpdateCreditNoteDtoReason>` 
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Option<std::collections::HashMap<String, serde_json::Value>>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credit_notes.<a href="/src/api/resources/credit_notes/client.rs">finalize</a>(id: String) -> Result&lt;CreditNoteResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.credit_notes.finalize(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credit_notes.<a href="/src/api/resources/credit_notes/client.rs">void</a>(id: String) -> Result&lt;CreditNoteResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.credit_notes.void(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## Portal
<details><summary><code>client.portal.<a href="/src/api/resources/portal/client.rs">get_billing</a>(external_id: String) -> Result&lt;(), ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .portal
        .get_billing(&"externalId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/src/api/resources/portal/client.rs">get_subscriptions</a>(external_id: String) -> Result&lt;Vec&lt;SubscriptionResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .portal
        .get_subscriptions(&"externalId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/src/api/resources/portal/client.rs">get_invoices</a>(external_id: String, status: Option&lt;Option&lt;GetInvoicesPortalRequestStatus&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedInvoiceResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .portal
        .get_invoices(
            &"externalId".to_string(),
            &GetInvoicesQueryRequest {
                status: None,
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**status:** `Option<GetInvoicesPortalRequestStatus>` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/src/api/resources/portal/client.rs">create_checkout</a>(external_id: String, invoice_id: String) -> Result&lt;CheckoutResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .portal
        .create_checkout(&"externalId".to_string(), &"invoiceId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/src/api/resources/portal/client.rs">get_payments</a>(external_id: String, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedPaymentResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .portal
        .get_payments(
            &"externalId".to_string(),
            &GetPaymentsQueryRequest2 {
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## BillableMetrics
<details><summary><code>client.billable_metrics.<a href="/src/api/resources/billable_metrics/client.rs">list</a>() -> Result&lt;Vec&lt;BillableMetricResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.billable_metrics.list(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billable_metrics.<a href="/src/api/resources/billable_metrics/client.rs">create</a>(request: CreateBillableMetricDto) -> Result&lt;BillableMetricResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .billable_metrics
        .create(
            &CreateBillableMetricDto {
                name: "API Calls".to_string(),
                code: "api_calls".to_string(),
                aggregation_type: CreateBillableMetricDtoAggregationType::Count,
                description: None,
                field_name: None,
                recurring: None,
                filters: None,
            },
            None,
        )
        .await;
}
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

**description:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**aggregation_type:** `CreateBillableMetricDtoAggregationType` 
    
</dd>
</dl>

<dl>
<dd>

**field_name:** `Option<String>` — Property key to aggregate (required for SUM, MAX, LATEST, WEIGHTED_SUM)
    
</dd>
</dl>

<dl>
<dd>

**recurring:** `Option<bool>` — If true, value carries forward across billing periods
    
</dd>
</dl>

<dl>
<dd>

**filters:** `Option<Vec<CreateBillableMetricFilterDto>>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billable_metrics.<a href="/src/api/resources/billable_metrics/client.rs">get</a>(id: String) -> Result&lt;BillableMetricResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.billable_metrics.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billable_metrics.<a href="/src/api/resources/billable_metrics/client.rs">delete</a>(id: String) -> Result&lt;BillableMetricResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .billable_metrics
        .delete(&"id".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billable_metrics.<a href="/src/api/resources/billable_metrics/client.rs">update</a>(id: String, request: UpdateBillableMetricDto) -> Result&lt;BillableMetricResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .billable_metrics
        .update(
            &"id".to_string(),
            &UpdateBillableMetricDto {
                name: None,
                description: None,
                field_name: None,
                recurring: None,
                filters: None,
            },
            None,
        )
        .await;
}
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

**name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**field_name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**recurring:** `Option<bool>` 
    
</dd>
</dl>

<dl>
<dd>

**filters:** `Option<Vec<CreateBillableMetricFilterDto>>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Events
<details><summary><code>client.events.<a href="/src/api/resources/events/client.rs">list</a>() -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.events.list(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/src/api/resources/events/client.rs">create</a>(request: CreateEventDto) -> Result&lt;UsageEventResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .events
        .create(
            &CreateEventDto {
                transaction_id: "evt_12345".to_string(),
                subscription_id: "sub_abc123".to_string(),
                code: "api_calls".to_string(),
                timestamp: None,
                properties: None,
            },
            None,
        )
        .await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/src/api/resources/events/client.rs">create_batch</a>(request: BatchEventsDto) -> Result&lt;BatchEventResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .events
        .create_batch(
            &BatchEventsDto {
                events: vec![CreateEventDto {
                    transaction_id: "evt_12345".to_string(),
                    subscription_id: "sub_abc123".to_string(),
                    code: "api_calls".to_string(),
                    timestamp: None,
                    properties: None,
                }],
            },
            None,
        )
        .await;
}
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

**events:** `Vec<CreateEventDto>` — Array of events to ingest (max 100)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/src/api/resources/events/client.rs">get</a>(id: String) -> Result&lt;UsageEventResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.events.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/src/api/resources/events/client.rs">get_by_subscription</a>(subscription_id: String, code: Option&lt;Option&lt;String&gt;&gt;, from: Option&lt;Option&lt;String&gt;&gt;, to: Option&lt;Option&lt;String&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, per_page: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedUsageEventResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .events
        .get_by_subscription(
            &"subscriptionId".to_string(),
            &GetBySubscriptionQueryRequest {
                code: None,
                from: None,
                to: None,
                page: None,
                per_page: None,
            },
            None,
        )
        .await;
}
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

**code:** `Option<String>` — Filter by metric code
    
</dd>
</dl>

<dl>
<dd>

**from:** `Option<String>` — Start date (ISO 8601)
    
</dd>
</dl>

<dl>
<dd>

**to:** `Option<String>` — End date (ISO 8601)
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**per_page:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Charges
<details><summary><code>client.charges.<a href="/src/api/resources/charges/client.rs">list</a>(plan_id: Option&lt;Option&lt;String&gt;&gt;) -> Result&lt;Vec&lt;ChargeResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .charges
        .list(&ListQueryRequest12 { plan_id: None }, None)
        .await;
}
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

**plan_id:** `Option<String>` — Filter by plan ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/src/api/resources/charges/client.rs">create</a>(request: CreateChargeDto) -> Result&lt;ChargeResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .charges
        .create(
            &CreateChargeDto {
                plan_id: "planId".to_string(),
                billable_metric_id: "billableMetricId".to_string(),
                charge_model: CreateChargeDtoChargeModel::Standard,
                billing_timing: None,
                invoice_display_name: None,
                min_amount_cents: None,
                prorated: None,
                properties: None,
                graduated_ranges: None,
                filters: None,
            },
            None,
        )
        .await;
}
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

**charge_model:** `CreateChargeDtoChargeModel` 
    
</dd>
</dl>

<dl>
<dd>

**billing_timing:** `Option<CreateChargeDtoBillingTiming>` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_display_name:** `Option<String>` — Display name on invoices
    
</dd>
</dl>

<dl>
<dd>

**min_amount_cents:** `Option<f64>` — Minimum charge in cents
    
</dd>
</dl>

<dl>
<dd>

**prorated:** `Option<bool>` 
    
</dd>
</dl>

<dl>
<dd>

**properties:** `Option<std::collections::HashMap<String, serde_json::Value>>` — Model-specific config. Standard: { amount, currency }. Package: { amount, packageSize, currency }. Percentage: { rate, fixedAmount, freeUnitsPerEvent, freeUnitsPerTotalAggregation }
    
</dd>
</dl>

<dl>
<dd>

**graduated_ranges:** `Option<Vec<GraduatedRangeDto>>` — Required for GRADUATED and VOLUME charge models
    
</dd>
</dl>

<dl>
<dd>

**filters:** `Option<Vec<ChargeFilterDto>>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/src/api/resources/charges/client.rs">get</a>(id: String) -> Result&lt;ChargeResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.charges.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/src/api/resources/charges/client.rs">delete</a>(id: String) -> Result&lt;ChargeResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.charges.delete(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/src/api/resources/charges/client.rs">update</a>(id: String, request: UpdateChargeDto) -> Result&lt;ChargeResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .charges
        .update(
            &"id".to_string(),
            &UpdateChargeDto {
                billing_timing: None,
                invoice_display_name: None,
                min_amount_cents: None,
                prorated: None,
                properties: None,
                graduated_ranges: None,
                filters: None,
            },
            None,
        )
        .await;
}
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

**billing_timing:** `Option<UpdateChargeDtoBillingTiming>` 
    
</dd>
</dl>

<dl>
<dd>

**invoice_display_name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**min_amount_cents:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**prorated:** `Option<bool>` 
    
</dd>
</dl>

<dl>
<dd>

**properties:** `Option<std::collections::HashMap<String, serde_json::Value>>` 
    
</dd>
</dl>

<dl>
<dd>

**graduated_ranges:** `Option<Vec<GraduatedRangeDto>>` 
    
</dd>
</dl>

<dl>
<dd>

**filters:** `Option<Vec<ChargeFilterDto>>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/src/api/resources/charges/client.rs">get_by_plan</a>(plan_id: String) -> Result&lt;Vec&lt;ChargeResponse&gt;, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .charges
        .get_by_plan(&"planId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## Wallets
<details><summary><code>client.wallets.<a href="/src/api/resources/wallets/client.rs">list</a>(customer_id: Option&lt;Option&lt;String&gt;&gt;, status: Option&lt;Option&lt;ListWalletsRequestStatus&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedWalletResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .wallets
        .list(
            &ListQueryRequest12 {
                customer_id: None,
                status: None,
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**customer_id:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**status:** `Option<ListWalletsRequestStatus>` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/src/api/resources/wallets/client.rs">create</a>(request: CreateWalletDto) -> Result&lt;WalletResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .wallets
        .create(
            &CreateWalletDto {
                customer_id: "cust_abc123".to_string(),
                currency: "USD".to_string(),
                name: None,
                rate_amount: None,
                paid_credits: None,
                granted_credits: None,
                expiration_at: None,
                metadata: None,
                created_at: None,
            },
            None,
        )
        .await;
}
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

**name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**rate_amount:** `Option<f64>` — 1 credit = rateAmount in currency
    
</dd>
</dl>

<dl>
<dd>

**paid_credits:** `Option<f64>` — Paid credits (purchase)
    
</dd>
</dl>

<dl>
<dd>

**granted_credits:** `Option<f64>` — Free credits (grant)
    
</dd>
</dl>

<dl>
<dd>

**expiration_at:** `Option<String>` — Expiration date (ISO 8601)
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Option<std::collections::HashMap<String, serde_json::Value>>` 
    
</dd>
</dl>

<dl>
<dd>

**created_at:** `Option<String>` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/src/api/resources/wallets/client.rs">get</a>(id: String) -> Result&lt;WalletResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.wallets.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/src/api/resources/wallets/client.rs">delete</a>(id: String) -> Result&lt;WalletResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.wallets.delete(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/src/api/resources/wallets/client.rs">update</a>(id: String, request: UpdateWalletDto) -> Result&lt;WalletResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .wallets
        .update(
            &"id".to_string(),
            &UpdateWalletDto {
                name: None,
                expiration_at: None,
                metadata: None,
            },
            None,
        )
        .await;
}
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

**name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**expiration_at:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Option<std::collections::HashMap<String, serde_json::Value>>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/src/api/resources/wallets/client.rs">create_transaction</a>(request: TopUpWalletDto) -> Result&lt;TopUpResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .wallets
        .create_transaction(
            &TopUpWalletDto {
                wallet_id: "wallet_id".to_string(),
                paid_credits: None,
                granted_credits: None,
                voided_credits: None,
                metadata: None,
            },
            None,
        )
        .await;
}
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

**paid_credits:** `Option<f64>` — Paid credits to purchase
    
</dd>
</dl>

<dl>
<dd>

**granted_credits:** `Option<f64>` — Free credits to grant
    
</dd>
</dl>

<dl>
<dd>

**voided_credits:** `Option<f64>` — Credits to void
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Option<std::collections::HashMap<String, serde_json::Value>>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/src/api/resources/wallets/client.rs">get_transactions</a>(id: String, status: Option&lt;Option&lt;GetTransactionsWalletsRequestStatus&gt;&gt;, transaction_status: Option&lt;Option&lt;GetTransactionsWalletsRequestTransactionStatus&gt;&gt;, transaction_type: Option&lt;Option&lt;GetTransactionsWalletsRequestTransactionType&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedWalletTransactionResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .wallets
        .get_transactions(
            &"id".to_string(),
            &GetTransactionsQueryRequest {
                status: None,
                transaction_status: None,
                transaction_type: None,
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**status:** `Option<GetTransactionsWalletsRequestStatus>` 
    
</dd>
</dl>

<dl>
<dd>

**transaction_status:** `Option<GetTransactionsWalletsRequestTransactionStatus>` 
    
</dd>
</dl>

<dl>
<dd>

**transaction_type:** `Option<GetTransactionsWalletsRequestTransactionType>` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## PaymentMethods
<details><summary><code>client.payment_methods.<a href="/src/api/resources/payment_methods/client.rs">list</a>() -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.payment_methods.list(None).await;
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_methods.<a href="/src/api/resources/payment_methods/client.rs">create</a>(request: CreatePaymentMethodDto) -> Result&lt;PaymentMethodResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .payment_methods
        .create(
            &CreatePaymentMethodDto {
                customer_id: "cus_abc123".to_string(),
                provider: "stripe".to_string(),
                token_id: "pm_abc123".to_string(),
                r#type: None,
                last4: None,
                brand: None,
                exp_month: None,
                exp_year: None,
                cardholder_name: None,
                country: None,
            },
            None,
        )
        .await;
}
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

**type:** `Option<CreatePaymentMethodDtoType>` 
    
</dd>
</dl>

<dl>
<dd>

**token_id:** `String` — Provider-specific token/payment method ID
    
</dd>
</dl>

<dl>
<dd>

**last4:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**brand:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**exp_month:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**exp_year:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**cardholder_name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**country:** `Option<String>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_methods.<a href="/src/api/resources/payment_methods/client.rs">get_by_customer</a>(customer_id: String) -> Result&lt;Vec&lt;PaymentMethodResponse&gt;, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .payment_methods
        .get_by_customer(&"customerId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_methods.<a href="/src/api/resources/payment_methods/client.rs">get</a>(id: String) -> Result&lt;PaymentMethodResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.payment_methods.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_methods.<a href="/src/api/resources/payment_methods/client.rs">delete</a>(id: String) -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.payment_methods.delete(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payment_methods.<a href="/src/api/resources/payment_methods/client.rs">set_default</a>(id: String) -> Result&lt;PaymentMethodResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .payment_methods
        .set_default(&"id".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## Taxes
<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">list</a>(applied_by_default: Option&lt;Option&lt;bool&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedTaxResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .taxes
        .list(
            &ListQueryRequest12 {
                applied_by_default: None,
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**applied_by_default:** `Option<bool>` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">create</a>(request: CreateTaxDto) -> Result&lt;TaxResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .taxes
        .create(
            &CreateTaxDto {
                name: "VAT".to_string(),
                code: "vat_18".to_string(),
                rate: 18.0,
                description: None,
                applied_by_default: None,
            },
            None,
        )
        .await;
}
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

**rate:** `f64` — Tax rate as a percentage (e.g., 18 for 18%)
    
</dd>
</dl>

<dl>
<dd>

**description:** `Option<String>` — Tax description
    
</dd>
</dl>

<dl>
<dd>

**applied_by_default:** `Option<bool>` — Whether this tax is applied by default to all invoices
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">get</a>(id: String) -> Result&lt;TaxResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.taxes.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">delete</a>(id: String) -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.taxes.delete(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">update</a>(id: String, request: UpdateTaxDto) -> Result&lt;TaxResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .taxes
        .update(
            &"id".to_string(),
            &UpdateTaxDto {
                name: None,
                rate: None,
                description: None,
                applied_by_default: None,
            },
            None,
        )
        .await;
}
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

**name:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**rate:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**applied_by_default:** `Option<bool>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">taxes_controller_get_customer_taxes</a>(customer_id: String) -> Result&lt;Vec&lt;TaxResponse&gt;, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .taxes
        .taxes_controller_get_customer_taxes(&"customerId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">assign_to_customer</a>(customer_id: String, request: AssignTaxDto) -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .taxes
        .assign_to_customer(
            &"customerId".to_string(),
            &AssignTaxDto {
                tax_id: "clx1234567890".to_string(),
            },
            None,
        )
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">remove_from_customer</a>(customer_id: String, tax_id: String) -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .taxes
        .remove_from_customer(&"customerId".to_string(), &"taxId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">taxes_controller_get_plan_taxes</a>(plan_id: String) -> Result&lt;Vec&lt;TaxResponse&gt;, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .taxes
        .taxes_controller_get_plan_taxes(&"planId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">assign_to_plan</a>(plan_id: String, request: AssignTaxDto) -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .taxes
        .assign_to_plan(
            &"planId".to_string(),
            &AssignTaxDto {
                tax_id: "clx1234567890".to_string(),
            },
            None,
        )
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">remove_from_plan</a>(plan_id: String, tax_id: String) -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .taxes
        .remove_from_plan(&"planId".to_string(), &"taxId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">assign_to_charge</a>(charge_id: String, request: AssignTaxDto) -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .taxes
        .assign_to_charge(
            &"chargeId".to_string(),
            &AssignTaxDto {
                tax_id: "clx1234567890".to_string(),
            },
            None,
        )
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/src/api/resources/taxes/client.rs">remove_from_charge</a>(charge_id: String, tax_id: String) -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .taxes
        .remove_from_charge(&"chargeId".to_string(), &"taxId".to_string(), None)
        .await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

## PlanOverrides
<details><summary><code>client.plan_overrides.<a href="/src/api/resources/plan_overrides/client.rs">list</a>(customer_id: Option&lt;Option&lt;String&gt;&gt;, plan_id: Option&lt;Option&lt;String&gt;&gt;, page: Option&lt;Option&lt;f64&gt;&gt;, limit: Option&lt;Option&lt;f64&gt;&gt;) -> Result&lt;PaginatedPlanOverrideResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .plan_overrides
        .list(
            &ListQueryRequest12 {
                customer_id: None,
                plan_id: None,
                page: None,
                limit: None,
            },
            None,
        )
        .await;
}
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

**customer_id:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**plan_id:** `Option<String>` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Option<f64>` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Option<f64>` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plan_overrides.<a href="/src/api/resources/plan_overrides/client.rs">create</a>(request: CreatePlanOverrideDto) -> Result&lt;PlanOverrideResponse, ApiError&gt;</code></summary>
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

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .plan_overrides
        .create(
            &CreatePlanOverrideDto {
                customer_id: "clx_customer_123".to_string(),
                plan_id: "clx_plan_456".to_string(),
                overridden_prices: None,
                overridden_minimum_commitment: None,
                overridden_charges: None,
                metadata: None,
            },
            None,
        )
        .await;
}
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

**overridden_prices:** `Option<Vec<String>>` — Override plan prices: array of { currency, amount }
    
</dd>
</dl>

<dl>
<dd>

**overridden_minimum_commitment:** `Option<f64>` — Override minimum commitment amount
    
</dd>
</dl>

<dl>
<dd>

**overridden_charges:** `Option<Vec<String>>` — Override charge properties: array of { chargeId, properties?, graduatedRanges? }
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Option<std::collections::HashMap<String, serde_json::Value>>` — Custom metadata
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plan_overrides.<a href="/src/api/resources/plan_overrides/client.rs">get</a>(id: String) -> Result&lt;PlanOverrideResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.plan_overrides.get(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plan_overrides.<a href="/src/api/resources/plan_overrides/client.rs">delete</a>(id: String) -> Result&lt;(), ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client.plan_overrides.delete(&"id".to_string(), None).await;
}
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
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plan_overrides.<a href="/src/api/resources/plan_overrides/client.rs">update</a>(id: String, request: UpdatePlanOverrideDto) -> Result&lt;PlanOverrideResponse, ApiError&gt;</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```rust
use novabilling_rust::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = NovaBillingClient::new(config).expect("Failed to build client");
    client
        .plan_overrides
        .update(
            &"id".to_string(),
            &UpdatePlanOverrideDto {
                overridden_prices: None,
                overridden_minimum_commitment: None,
                overridden_charges: None,
                metadata: None,
            },
            None,
        )
        .await;
}
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

**overridden_prices:** `Option<Vec<String>>` — Override plan prices
    
</dd>
</dl>

<dl>
<dd>

**overridden_minimum_commitment:** `Option<f64>` — Override minimum commitment amount
    
</dd>
</dl>

<dl>
<dd>

**overridden_charges:** `Option<Vec<String>>` — Override charge properties
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `Option<std::collections::HashMap<String, serde_json::Value>>` — Custom metadata
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>
