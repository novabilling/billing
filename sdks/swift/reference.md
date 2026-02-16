# Reference
## Auth
<details><summary><code>client.auth.<a href="/Sources/Resources/Auth/AuthClient.swift">register</a>(request: Requests.RegisterDto, requestOptions: RequestOptions?) -> RegisterResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.auth.register(request: .init(
        name: "John Doe",
        email: "john@company.com",
        password: "securePassword123",
        companyName: "Acme Corp"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.RegisterDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/Sources/Resources/Auth/AuthClient.swift">login</a>(request: Requests.LoginDto, requestOptions: RequestOptions?) -> LoginResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.auth.login(request: .init(
        email: "john@company.com",
        password: "securePassword123"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.LoginDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/Sources/Resources/Auth/AuthClient.swift">refreshToken</a>(request: Requests.RefreshTokenDto, requestOptions: RequestOptions?) -> TokenPairResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.auth.refreshToken(request: .init(refreshToken: "refreshToken"))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.RefreshTokenDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/Sources/Resources/Auth/AuthClient.swift">forgotPassword</a>(request: Requests.ForgotPasswordDto, requestOptions: RequestOptions?) -> MessageResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.auth.forgotPassword(request: .init(email: "john@company.com"))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.ForgotPasswordDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/Sources/Resources/Auth/AuthClient.swift">resetPassword</a>(request: Requests.ResetPasswordDto, requestOptions: RequestOptions?) -> MessageResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.auth.resetPassword(request: .init(
        token: "token",
        newPassword: "newSecurePassword123"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.ResetPasswordDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Tenants
<details><summary><code>client.tenants.<a href="/Sources/Resources/Tenants/TenantsClient.swift">getMe</a>(requestOptions: RequestOptions?) -> TenantResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.tenants.getMe()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.tenants.<a href="/Sources/Resources/Tenants/TenantsClient.swift">updateMe</a>(request: Requests.UpdateTenantDto, requestOptions: RequestOptions?) -> TenantResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.tenants.updateMe(request: .init())
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.UpdateTenantDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.tenants.<a href="/Sources/Resources/Tenants/TenantsClient.swift">getUsage</a>(requestOptions: RequestOptions?) -> TenantUsageResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.tenants.getUsage()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.tenants.<a href="/Sources/Resources/Tenants/TenantsClient.swift">testSmtp</a>(request: Requests.TestSmtpTenantsRequest, requestOptions: RequestOptions?) -> MessageResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.tenants.testSmtp(request: .init(to: "test@example.com"))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.TestSmtpTenantsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ApiKeys
<details><summary><code>client.apiKeys.<a href="/Sources/Resources/ApiKeys/ApiKeysClient.swift">list</a>(requestOptions: RequestOptions?) -> [ApiKeyResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.apiKeys.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.apiKeys.<a href="/Sources/Resources/ApiKeys/ApiKeysClient.swift">create</a>(request: Requests.CreateApiKeyBodyDto, requestOptions: RequestOptions?) -> ApiKeyResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.apiKeys.create(request: .init(
        name: "Production API Key",
        scopes: [
            "read",
            "write"
        ]
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateApiKeyBodyDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.apiKeys.<a href="/Sources/Resources/ApiKeys/ApiKeysClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.apiKeys.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Currencies
<details><summary><code>client.currencies.<a href="/Sources/Resources/Currencies/CurrenciesClient.swift">list</a>(requestOptions: RequestOptions?) -> [CurrencyResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.currencies.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Customers
<details><summary><code>client.customers.<a href="/Sources/Resources/Customers/CustomersClient.swift">list</a>(page: Double?, limit: Double?, search: String?, country: String?, currency: String?, sortBy: String?, sortOrder: ListCustomersRequestSortOrder?, requestOptions: RequestOptions?) -> PaginatedCustomerResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.customers.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**search:** `String?` — Search by name or email
    
</dd>
</dl>

<dl>
<dd>

**country:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**sortBy:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**sortOrder:** `ListCustomersRequestSortOrder?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/Sources/Resources/Customers/CustomersClient.swift">create</a>(request: Requests.CreateCustomerDto, requestOptions: RequestOptions?) -> CustomerResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.customers.create(request: .init(
        externalId: "user_12345",
        email: "customer@example.com",
        currency: "NGN"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateCustomerDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/Sources/Resources/Customers/CustomersClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> CustomerResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.customers.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/Sources/Resources/Customers/CustomersClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.customers.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/Sources/Resources/Customers/CustomersClient.swift">update</a>(id: String, request: Requests.UpdateCustomerDto, requestOptions: RequestOptions?) -> CustomerResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.customers.update(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdateCustomerDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/Sources/Resources/Customers/CustomersClient.swift">getSubscriptions</a>(id: String, requestOptions: RequestOptions?) -> [SubscriptionResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.customers.getSubscriptions(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/Sources/Resources/Customers/CustomersClient.swift">getInvoices</a>(id: String, requestOptions: RequestOptions?) -> [InvoiceResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.customers.getInvoices(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/Sources/Resources/Customers/CustomersClient.swift">getPayments</a>(id: String, requestOptions: RequestOptions?) -> [PaymentResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.customers.getPayments(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/Sources/Resources/Customers/CustomersClient.swift">getPaymentMethods</a>(id: String, requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.customers.getPaymentMethods(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/Sources/Resources/Customers/CustomersClient.swift">addPaymentMethod</a>(id: String, requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.customers.addPaymentMethod(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/Sources/Resources/Customers/CustomersClient.swift">deletePaymentMethod</a>(id: String, methodId: String, requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.customers.deletePaymentMethod(
        id: "id",
        methodId: "methodId"
    )
}

try await main()
```
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

**methodId:** `String` — Payment method ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Plans
<details><summary><code>client.plans.<a href="/Sources/Resources/Plans/PlansClient.swift">list</a>(isActive: Bool?, requestOptions: RequestOptions?) -> [PlanResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.plans.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**isActive:** `Bool?` — Filter by active status
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/Sources/Resources/Plans/PlansClient.swift">create</a>(request: Requests.CreatePlanDto, requestOptions: RequestOptions?) -> PlanResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.plans.create(request: .init(
        name: "Premium Monthly",
        code: "premium_monthly",
        billingInterval: .hourly
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreatePlanDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/Sources/Resources/Plans/PlansClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> PlanResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.plans.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/Sources/Resources/Plans/PlansClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> PlanResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.plans.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/Sources/Resources/Plans/PlansClient.swift">update</a>(id: String, request: Requests.UpdatePlanDto, requestOptions: RequestOptions?) -> PlanResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.plans.update(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdatePlanDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/Sources/Resources/Plans/PlansClient.swift">addPrice</a>(id: String, request: CreatePlanPriceDto, requestOptions: RequestOptions?) -> PlanPriceResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.plans.addPrice(
        id: "id",
        request: .init(body: CreatePlanPriceDto(
            currency: "NGN",
            amount: 9999.99
        ))
    )
}

try await main()
```
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

**request:** `CreatePlanPriceDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/Sources/Resources/Plans/PlansClient.swift">deletePrice</a>(id: String, priceId: String, requestOptions: RequestOptions?) -> PlanPriceResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.plans.deletePrice(
        id: "id",
        priceId: "priceId"
    )
}

try await main()
```
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

**priceId:** `String` — Price ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/Sources/Resources/Plans/PlansClient.swift">updatePrice</a>(id: String, priceId: String, requestOptions: RequestOptions?) -> PlanPriceResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.plans.updatePrice(
        id: "id",
        priceId: "priceId"
    )
}

try await main()
```
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

**priceId:** `String` — Price ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Subscriptions
<details><summary><code>client.subscriptions.<a href="/Sources/Resources/Subscriptions/SubscriptionsClient.swift">list</a>(status: String?, customerId: String?, planId: String?, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedSubscriptionResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.subscriptions.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**status:** `String?` — Filter by status (ACTIVE, TRIALING, PAUSED, CANCELED)
    
</dd>
</dl>

<dl>
<dd>

**customerId:** `String?` — Filter by customer ID
    
</dd>
</dl>

<dl>
<dd>

**planId:** `String?` — Filter by plan ID
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/Sources/Resources/Subscriptions/SubscriptionsClient.swift">create</a>(request: Requests.CreateSubscriptionDto, requestOptions: RequestOptions?) -> SubscriptionResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.subscriptions.create(request: .init(
        customerId: "customerId",
        planId: "planId",
        currency: "NGN"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateSubscriptionDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/Sources/Resources/Subscriptions/SubscriptionsClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> SubscriptionResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.subscriptions.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/Sources/Resources/Subscriptions/SubscriptionsClient.swift">update</a>(id: String, request: Requests.UpdateSubscriptionDto, requestOptions: RequestOptions?) -> SubscriptionResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.subscriptions.update(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdateSubscriptionDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/Sources/Resources/Subscriptions/SubscriptionsClient.swift">cancel</a>(id: String, request: Requests.CancelSubscriptionDto, requestOptions: RequestOptions?) -> SubscriptionResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.subscriptions.cancel(
        id: "id",
        request: .init(cancelAt: .now)
    )
}

try await main()
```
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

**request:** `Requests.CancelSubscriptionDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/Sources/Resources/Subscriptions/SubscriptionsClient.swift">pause</a>(id: String, requestOptions: RequestOptions?) -> SubscriptionResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.subscriptions.pause(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/Sources/Resources/Subscriptions/SubscriptionsClient.swift">resume</a>(id: String, requestOptions: RequestOptions?) -> SubscriptionResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.subscriptions.resume(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.subscriptions.<a href="/Sources/Resources/Subscriptions/SubscriptionsClient.swift">changePlan</a>(id: String, request: Requests.ChangePlanDto, requestOptions: RequestOptions?) -> SubscriptionResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.subscriptions.changePlan(
        id: "id",
        request: .init(newPlanId: "newPlanId")
    )
}

try await main()
```
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

**request:** `Requests.ChangePlanDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Invoices
<details><summary><code>client.invoices.<a href="/Sources/Resources/Invoices/InvoicesClient.swift">list</a>(status: String?, customerId: String?, dateFrom: String?, dateTo: String?, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedInvoiceResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.invoices.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**status:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**customerId:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**dateFrom:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/Sources/Resources/Invoices/InvoicesClient.swift">create</a>(request: Requests.CreateInvoiceDto, requestOptions: RequestOptions?) -> InvoiceResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.invoices.create(request: .init(
        customerId: "customerId",
        items: [
            InvoiceItemDto(
                description: "Premium Monthly Plan",
                quantity: 1,
                unitAmount: 9999.99
            )
        ],
        dueDate: "2025-02-15"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateInvoiceDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/Sources/Resources/Invoices/InvoicesClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> InvoiceResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.invoices.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/Sources/Resources/Invoices/InvoicesClient.swift">finalize</a>(id: String, requestOptions: RequestOptions?) -> InvoiceResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.invoices.finalize(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/Sources/Resources/Invoices/InvoicesClient.swift">void</a>(id: String, requestOptions: RequestOptions?) -> InvoiceResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.invoices.void(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/Sources/Resources/Invoices/InvoicesClient.swift">markPaid</a>(id: String, request: Requests.MarkPaidInvoicesRequest, requestOptions: RequestOptions?) -> InvoiceResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.invoices.markPaid(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.MarkPaidInvoicesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/Sources/Resources/Invoices/InvoicesClient.swift">createCheckout</a>(id: String, request: Requests.CreateCheckoutInvoicesRequest, requestOptions: RequestOptions?) -> CheckoutResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.invoices.createCheckout(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.CreateCheckoutInvoicesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/Sources/Resources/Invoices/InvoicesClient.swift">sendEmail</a>(id: String, request: Requests.SendEmailInvoicesRequest, requestOptions: RequestOptions?) -> MessageResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.invoices.sendEmail(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.SendEmailInvoicesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/Sources/Resources/Invoices/InvoicesClient.swift">getPdf</a>(id: String, requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.invoices.getPdf(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Payments
<details><summary><code>client.payments.<a href="/Sources/Resources/Payments/PaymentsClient.swift">list</a>(status: String?, provider: String?, invoiceId: String?, dateFrom: String?, dateTo: String?, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedPaymentResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.payments.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**status:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**provider:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**invoiceId:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**dateFrom:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payments.<a href="/Sources/Resources/Payments/PaymentsClient.swift">paymentsControllerCreate</a>(request: Requests.CreatePaymentDto, requestOptions: RequestOptions?) -> PaymentResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.payments.paymentsControllerCreate(request: .init(
        invoiceId: "invoiceId",
        provider: "manual",
        amount: 49.99,
        currency: "USD",
        status: .processing
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreatePaymentDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payments.<a href="/Sources/Resources/Payments/PaymentsClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> PaymentResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.payments.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payments.<a href="/Sources/Resources/Payments/PaymentsClient.swift">refund</a>(id: String, request: Requests.RefundPaymentDto, requestOptions: RequestOptions?) -> PaymentResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.payments.refund(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.RefundPaymentDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Payment Providers
<details><summary><code>client.paymentProviders.<a href="/Sources/Resources/PaymentProviders/PaymentProvidersClient.swift">list</a>(requestOptions: RequestOptions?) -> [PaymentProviderResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentProviders.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentProviders.<a href="/Sources/Resources/PaymentProviders/PaymentProvidersClient.swift">configure</a>(request: Requests.CreateProviderDto, requestOptions: RequestOptions?) -> PaymentProviderResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentProviders.configure(request: .init(
        providerName: "flutterwave",
        credentials: [
            "key": .string("value")
        ]
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateProviderDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentProviders.<a href="/Sources/Resources/PaymentProviders/PaymentProvidersClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> PaymentProviderResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentProviders.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentProviders.<a href="/Sources/Resources/PaymentProviders/PaymentProvidersClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> PaymentProviderResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentProviders.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentProviders.<a href="/Sources/Resources/PaymentProviders/PaymentProvidersClient.swift">update</a>(id: String, request: Requests.UpdateProviderDto, requestOptions: RequestOptions?) -> PaymentProviderResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentProviders.update(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdateProviderDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentProviders.<a href="/Sources/Resources/PaymentProviders/PaymentProvidersClient.swift">testConnection</a>(id: String, requestOptions: RequestOptions?) -> ProviderTestResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentProviders.testConnection(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Webhooks
<details><summary><code>client.webhooks.<a href="/Sources/Resources/Webhooks/WebhooksClient.swift">webhooksControllerPaystack</a>(paystackSignature: String, requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.webhooks.webhooksControllerPaystack()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**paystackSignature:** `String` — Paystack HMAC-SHA512 signature
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/Sources/Resources/Webhooks/WebhooksClient.swift">webhooksControllerFlutterwave</a>(verifHash: String?, requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.webhooks.webhooksControllerFlutterwave()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**verifHash:** `String?` — Flutterwave verification hash
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/Sources/Resources/Webhooks/WebhooksClient.swift">webhooksControllerDpo</a>(requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.webhooks.webhooksControllerDpo()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/Sources/Resources/Webhooks/WebhooksClient.swift">webhooksControllerPayu</a>(requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.webhooks.webhooksControllerPayu()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/Sources/Resources/Webhooks/WebhooksClient.swift">webhooksControllerPesapal</a>(requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.webhooks.webhooksControllerPesapal()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/Sources/Resources/Webhooks/WebhooksClient.swift">webhooksControllerStripe</a>(stripeSignature: String, requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.webhooks.webhooksControllerStripe()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**stripeSignature:** `String` — Stripe webhook signature
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Analytics
<details><summary><code>client.analytics.<a href="/Sources/Resources/Analytics/AnalyticsClient.swift">getRevenue</a>(dateFrom: String?, dateTo: String?, currency: String?, groupBy: GetRevenueAnalyticsRequestGroupBy?, requestOptions: RequestOptions?) -> RevenueAnalyticsResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.analytics.getRevenue(
        dateFrom: "2025-01-01",
        dateTo: "2025-12-31"
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dateFrom:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `GetRevenueAnalyticsRequestGroupBy?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/Sources/Resources/Analytics/AnalyticsClient.swift">getSubscriptions</a>(dateFrom: String?, dateTo: String?, currency: String?, groupBy: GetSubscriptionsAnalyticsRequestGroupBy?, requestOptions: RequestOptions?) -> SubscriptionAnalyticsResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.analytics.getSubscriptions(
        dateFrom: "2025-01-01",
        dateTo: "2025-12-31"
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dateFrom:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `GetSubscriptionsAnalyticsRequestGroupBy?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/Sources/Resources/Analytics/AnalyticsClient.swift">getCustomers</a>(dateFrom: String?, dateTo: String?, currency: String?, groupBy: GetCustomersAnalyticsRequestGroupBy?, requestOptions: RequestOptions?) -> CustomerAnalyticsResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.analytics.getCustomers(
        dateFrom: "2025-01-01",
        dateTo: "2025-12-31"
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dateFrom:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `GetCustomersAnalyticsRequestGroupBy?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/Sources/Resources/Analytics/AnalyticsClient.swift">getPayments</a>(dateFrom: String?, dateTo: String?, currency: String?, groupBy: GetPaymentsAnalyticsRequestGroupBy?, provider: String?, requestOptions: RequestOptions?) -> PaymentAnalyticsResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.analytics.getPayments(
        dateFrom: "2025-01-01",
        dateTo: "2025-12-31"
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dateFrom:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `GetPaymentsAnalyticsRequestGroupBy?` 
    
</dd>
</dl>

<dl>
<dd>

**provider:** `String?` — Filter by payment provider name
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/Sources/Resources/Analytics/AnalyticsClient.swift">getMrrBreakdown</a>(dateFrom: String?, dateTo: String?, currency: String?, groupBy: GetMrrBreakdownAnalyticsRequestGroupBy?, requestOptions: RequestOptions?) -> MrrBreakdownResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.analytics.getMrrBreakdown(
        dateFrom: "2025-01-01",
        dateTo: "2025-12-31"
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dateFrom:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `GetMrrBreakdownAnalyticsRequestGroupBy?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/Sources/Resources/Analytics/AnalyticsClient.swift">getNetRevenue</a>(dateFrom: String?, dateTo: String?, currency: String?, groupBy: GetNetRevenueAnalyticsRequestGroupBy?, requestOptions: RequestOptions?) -> NetRevenueResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.analytics.getNetRevenue(
        dateFrom: "2025-01-01",
        dateTo: "2025-12-31"
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dateFrom:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `GetNetRevenueAnalyticsRequestGroupBy?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/Sources/Resources/Analytics/AnalyticsClient.swift">getChurnCohorts</a>(months: Double?, requestOptions: RequestOptions?) -> ChurnCohortsResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.analytics.getChurnCohorts()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**months:** `Double?` — Number of months to analyze (default 12)
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/Sources/Resources/Analytics/AnalyticsClient.swift">getLifetimeValue</a>(requestOptions: RequestOptions?) -> LtvResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.analytics.getLifetimeValue()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Coupons
<details><summary><code>client.coupons.<a href="/Sources/Resources/Coupons/CouponsClient.swift">list</a>(isActive: Bool?, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedCouponResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.coupons.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**isActive:** `Bool?` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/Sources/Resources/Coupons/CouponsClient.swift">create</a>(request: Requests.CreateCouponDto, requestOptions: RequestOptions?) -> CouponResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.coupons.create(request: .init(
        code: "WELCOME20",
        name: "20% Welcome Discount",
        discountType: .percentage,
        discountValue: 20
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateCouponDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/Sources/Resources/Coupons/CouponsClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> CouponResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.coupons.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/Sources/Resources/Coupons/CouponsClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> CouponResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.coupons.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/Sources/Resources/Coupons/CouponsClient.swift">update</a>(id: String, request: Requests.UpdateCouponDto, requestOptions: RequestOptions?) -> CouponResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.coupons.update(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdateCouponDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/Sources/Resources/Coupons/CouponsClient.swift">apply</a>(request: Requests.ApplyCouponDto, requestOptions: RequestOptions?) -> AppliedCouponResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.coupons.apply(request: .init(
        couponId: "couponId",
        customerId: "customerId"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.ApplyCouponDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.coupons.<a href="/Sources/Resources/Coupons/CouponsClient.swift">removeApplied</a>(id: String, requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.coupons.removeApplied(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## AddOns
<details><summary><code>client.addOns.<a href="/Sources/Resources/AddOns/AddOnsClient.swift">list</a>(page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedAddOnResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.addOns.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.addOns.<a href="/Sources/Resources/AddOns/AddOnsClient.swift">create</a>(request: Requests.CreateAddOnDto, requestOptions: RequestOptions?) -> AddOnResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.addOns.create(request: .init(
        name: "Premium Support",
        code: "premium_support",
        prices: [
            AddOnPriceDto(
                currency: "UGX",
                amount: 50000
            )
        ]
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateAddOnDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.addOns.<a href="/Sources/Resources/AddOns/AddOnsClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> AddOnResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.addOns.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.addOns.<a href="/Sources/Resources/AddOns/AddOnsClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> AddOnResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.addOns.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.addOns.<a href="/Sources/Resources/AddOns/AddOnsClient.swift">update</a>(id: String, request: Requests.UpdateAddOnDto, requestOptions: RequestOptions?) -> AddOnResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.addOns.update(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdateAddOnDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.addOns.<a href="/Sources/Resources/AddOns/AddOnsClient.swift">apply</a>(request: Requests.ApplyAddOnDto, requestOptions: RequestOptions?) -> AppliedAddOnResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.addOns.apply(request: .init(
        addOnId: "addOnId",
        customerId: "customerId",
        amount: 50000,
        currency: "UGX"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.ApplyAddOnDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.addOns.<a href="/Sources/Resources/AddOns/AddOnsClient.swift">listApplied</a>(customerId: String?, invoiced: Bool?, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> [AppliedAddOnResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.addOns.listApplied()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**invoiced:** `Bool?` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.addOns.<a href="/Sources/Resources/AddOns/AddOnsClient.swift">removeApplied</a>(id: String, requestOptions: RequestOptions?) -> AppliedAddOnResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.addOns.removeApplied(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## CreditNotes
<details><summary><code>client.creditNotes.<a href="/Sources/Resources/CreditNotes/CreditNotesClient.swift">list</a>(customerId: String?, invoiceId: String?, status: ListCreditNotesRequestStatus?, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedCreditNoteResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.creditNotes.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**invoiceId:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**status:** `ListCreditNotesRequestStatus?` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.creditNotes.<a href="/Sources/Resources/CreditNotes/CreditNotesClient.swift">create</a>(request: Requests.CreateCreditNoteDto, requestOptions: RequestOptions?) -> CreditNoteResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.creditNotes.create(request: .init(
        invoiceId: "invoiceId",
        customerId: "customerId",
        amount: 25000,
        currency: "UGX",
        reason: .duplicate
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateCreditNoteDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.creditNotes.<a href="/Sources/Resources/CreditNotes/CreditNotesClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> CreditNoteResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.creditNotes.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.creditNotes.<a href="/Sources/Resources/CreditNotes/CreditNotesClient.swift">creditNotesControllerUpdate</a>(id: String, request: Requests.UpdateCreditNoteDto, requestOptions: RequestOptions?) -> CreditNoteResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.creditNotes.creditNotesControllerUpdate(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdateCreditNoteDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.creditNotes.<a href="/Sources/Resources/CreditNotes/CreditNotesClient.swift">finalize</a>(id: String, requestOptions: RequestOptions?) -> CreditNoteResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.creditNotes.finalize(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.creditNotes.<a href="/Sources/Resources/CreditNotes/CreditNotesClient.swift">void</a>(id: String, requestOptions: RequestOptions?) -> CreditNoteResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.creditNotes.void(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Portal
<details><summary><code>client.portal.<a href="/Sources/Resources/Portal/PortalClient.swift">getBilling</a>(externalId: String, requestOptions: RequestOptions?) -> Void</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.portal.getBilling(externalId: "externalId")
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `String` — Customer external ID (your app user ID)
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/Sources/Resources/Portal/PortalClient.swift">getSubscriptions</a>(externalId: String, requestOptions: RequestOptions?) -> [SubscriptionResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.portal.getSubscriptions(externalId: "externalId")
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `String` — Customer external ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/Sources/Resources/Portal/PortalClient.swift">getInvoices</a>(externalId: String, status: GetInvoicesPortalRequestStatus?, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedInvoiceResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.portal.getInvoices(externalId: "externalId")
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `String` — Customer external ID
    
</dd>
</dl>

<dl>
<dd>

**status:** `GetInvoicesPortalRequestStatus?` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/Sources/Resources/Portal/PortalClient.swift">createCheckout</a>(externalId: String, invoiceId: String, requestOptions: RequestOptions?) -> CheckoutResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.portal.createCheckout(
        externalId: "externalId",
        invoiceId: "invoiceId"
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `String` — Customer external ID
    
</dd>
</dl>

<dl>
<dd>

**invoiceId:** `String` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.portal.<a href="/Sources/Resources/Portal/PortalClient.swift">getPayments</a>(externalId: String, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedPaymentResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.portal.getPayments(externalId: "externalId")
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `String` — Customer external ID
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## BillableMetrics
<details><summary><code>client.billableMetrics.<a href="/Sources/Resources/BillableMetrics/BillableMetricsClient.swift">list</a>(requestOptions: RequestOptions?) -> [BillableMetricResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.billableMetrics.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billableMetrics.<a href="/Sources/Resources/BillableMetrics/BillableMetricsClient.swift">create</a>(request: Requests.CreateBillableMetricDto, requestOptions: RequestOptions?) -> BillableMetricResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.billableMetrics.create(request: .init(
        name: "API Calls",
        code: "api_calls",
        aggregationType: .count
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateBillableMetricDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billableMetrics.<a href="/Sources/Resources/BillableMetrics/BillableMetricsClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> BillableMetricResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.billableMetrics.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billableMetrics.<a href="/Sources/Resources/BillableMetrics/BillableMetricsClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> BillableMetricResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.billableMetrics.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.billableMetrics.<a href="/Sources/Resources/BillableMetrics/BillableMetricsClient.swift">update</a>(id: String, request: Requests.UpdateBillableMetricDto, requestOptions: RequestOptions?) -> BillableMetricResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.billableMetrics.update(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdateBillableMetricDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Events
<details><summary><code>client.events.<a href="/Sources/Resources/Events/EventsClient.swift">list</a>(requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.events.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/Sources/Resources/Events/EventsClient.swift">create</a>(request: CreateEventDto, requestOptions: RequestOptions?) -> UsageEventResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.events.create(request: CreateEventDto(
        transactionId: "evt_12345",
        subscriptionId: "sub_abc123",
        code: "api_calls"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `CreateEventDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/Sources/Resources/Events/EventsClient.swift">createBatch</a>(request: Requests.BatchEventsDto, requestOptions: RequestOptions?) -> BatchEventResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.events.createBatch(request: .init(events: [
        CreateEventDto(
            transactionId: "evt_12345",
            subscriptionId: "sub_abc123",
            code: "api_calls"
        )
    ]))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.BatchEventsDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/Sources/Resources/Events/EventsClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> UsageEventResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.events.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.events.<a href="/Sources/Resources/Events/EventsClient.swift">getBySubscription</a>(subscriptionId: String, code: String?, from: String?, to: String?, page: Double?, perPage: Double?, requestOptions: RequestOptions?) -> PaginatedUsageEventResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.events.getBySubscription(subscriptionId: "subscriptionId")
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**subscriptionId:** `String` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**code:** `String?` — Filter by metric code
    
</dd>
</dl>

<dl>
<dd>

**from:** `String?` — Start date (ISO 8601)
    
</dd>
</dl>

<dl>
<dd>

**to:** `String?` — End date (ISO 8601)
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**perPage:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Charges
<details><summary><code>client.charges.<a href="/Sources/Resources/Charges/ChargesClient.swift">list</a>(planId: String?, requestOptions: RequestOptions?) -> [ChargeResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.charges.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**planId:** `String?` — Filter by plan ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/Sources/Resources/Charges/ChargesClient.swift">create</a>(request: Requests.CreateChargeDto, requestOptions: RequestOptions?) -> ChargeResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.charges.create(request: .init(
        planId: "planId",
        billableMetricId: "billableMetricId",
        chargeModel: .standard
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateChargeDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/Sources/Resources/Charges/ChargesClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> ChargeResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.charges.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/Sources/Resources/Charges/ChargesClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> ChargeResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.charges.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/Sources/Resources/Charges/ChargesClient.swift">update</a>(id: String, request: Requests.UpdateChargeDto, requestOptions: RequestOptions?) -> ChargeResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.charges.update(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdateChargeDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.charges.<a href="/Sources/Resources/Charges/ChargesClient.swift">getByPlan</a>(planId: String, requestOptions: RequestOptions?) -> [ChargeResponse]</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.charges.getByPlan(planId: "planId")
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**planId:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Wallets
<details><summary><code>client.wallets.<a href="/Sources/Resources/Wallets/WalletsClient.swift">list</a>(customerId: String?, status: ListWalletsRequestStatus?, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedWalletResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.wallets.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**status:** `ListWalletsRequestStatus?` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/Sources/Resources/Wallets/WalletsClient.swift">create</a>(request: Requests.CreateWalletDto, requestOptions: RequestOptions?) -> WalletResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.wallets.create(request: .init(
        customerId: "cust_abc123",
        currency: "USD"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateWalletDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/Sources/Resources/Wallets/WalletsClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> WalletResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.wallets.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/Sources/Resources/Wallets/WalletsClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> WalletResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.wallets.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/Sources/Resources/Wallets/WalletsClient.swift">update</a>(id: String, request: Requests.UpdateWalletDto, requestOptions: RequestOptions?) -> WalletResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.wallets.update(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdateWalletDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/Sources/Resources/Wallets/WalletsClient.swift">createTransaction</a>(request: Requests.TopUpWalletDto, requestOptions: RequestOptions?) -> TopUpResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.wallets.createTransaction(request: .init(walletId: "wallet_id"))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.TopUpWalletDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.wallets.<a href="/Sources/Resources/Wallets/WalletsClient.swift">getTransactions</a>(id: String, status: GetTransactionsWalletsRequestStatus?, transactionStatus: GetTransactionsWalletsRequestTransactionStatus?, transactionType: GetTransactionsWalletsRequestTransactionType?, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedWalletTransactionResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.wallets.getTransactions(id: "id")
}

try await main()
```
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

**status:** `GetTransactionsWalletsRequestStatus?` 
    
</dd>
</dl>

<dl>
<dd>

**transactionStatus:** `GetTransactionsWalletsRequestTransactionStatus?` 
    
</dd>
</dl>

<dl>
<dd>

**transactionType:** `GetTransactionsWalletsRequestTransactionType?` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## PaymentMethods
<details><summary><code>client.paymentMethods.<a href="/Sources/Resources/PaymentMethods/PaymentMethodsClient.swift">list</a>(requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentMethods.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentMethods.<a href="/Sources/Resources/PaymentMethods/PaymentMethodsClient.swift">create</a>(request: Requests.CreatePaymentMethodDto, requestOptions: RequestOptions?) -> PaymentMethodResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentMethods.create(request: .init(
        customerId: "cus_abc123",
        provider: "stripe",
        tokenId: "pm_abc123"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreatePaymentMethodDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentMethods.<a href="/Sources/Resources/PaymentMethods/PaymentMethodsClient.swift">getByCustomer</a>(customerId: String, requestOptions: RequestOptions?) -> [PaymentMethodResponse]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentMethods.getByCustomer(customerId: "customerId")
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `String` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentMethods.<a href="/Sources/Resources/PaymentMethods/PaymentMethodsClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> PaymentMethodResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentMethods.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentMethods.<a href="/Sources/Resources/PaymentMethods/PaymentMethodsClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentMethods.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentMethods.<a href="/Sources/Resources/PaymentMethods/PaymentMethodsClient.swift">setDefault</a>(id: String, requestOptions: RequestOptions?) -> PaymentMethodResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.paymentMethods.setDefault(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Taxes
<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">list</a>(appliedByDefault: Bool?, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedTaxResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appliedByDefault:** `Bool?` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">create</a>(request: Requests.CreateTaxDto, requestOptions: RequestOptions?) -> TaxResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.create(request: .init(
        name: "VAT",
        code: "vat_18",
        rate: 18
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreateTaxDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> TaxResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">update</a>(id: String, request: Requests.UpdateTaxDto, requestOptions: RequestOptions?) -> TaxResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.update(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdateTaxDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">taxesControllerGetCustomerTaxes</a>(customerId: String, requestOptions: RequestOptions?) -> [TaxResponse]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.taxesControllerGetCustomerTaxes(customerId: "customerId")
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">assignToCustomer</a>(customerId: String, request: AssignTaxDto, requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.assignToCustomer(
        customerId: "customerId",
        request: .init(body: AssignTaxDto(
            taxId: "clx1234567890"
        ))
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `AssignTaxDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">removeFromCustomer</a>(customerId: String, taxId: String, requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.removeFromCustomer(
        customerId: "customerId",
        taxId: "taxId"
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `String` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**taxId:** `String` — Tax ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">taxesControllerGetPlanTaxes</a>(planId: String, requestOptions: RequestOptions?) -> [TaxResponse]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.taxesControllerGetPlanTaxes(planId: "planId")
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**planId:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">assignToPlan</a>(planId: String, request: AssignTaxDto, requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.assignToPlan(
        planId: "planId",
        request: .init(body: AssignTaxDto(
            taxId: "clx1234567890"
        ))
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**planId:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `AssignTaxDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">removeFromPlan</a>(planId: String, taxId: String, requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.removeFromPlan(
        planId: "planId",
        taxId: "taxId"
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**planId:** `String` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**taxId:** `String` — Tax ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">assignToCharge</a>(chargeId: String, request: AssignTaxDto, requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.assignToCharge(
        chargeId: "chargeId",
        request: .init(body: AssignTaxDto(
            taxId: "clx1234567890"
        ))
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**chargeId:** `String` — Charge ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `AssignTaxDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.taxes.<a href="/Sources/Resources/Taxes/TaxesClient.swift">removeFromCharge</a>(chargeId: String, taxId: String, requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.taxes.removeFromCharge(
        chargeId: "chargeId",
        taxId: "taxId"
    )
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**chargeId:** `String` — Charge ID
    
</dd>
</dl>

<dl>
<dd>

**taxId:** `String` — Tax ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## PlanOverrides
<details><summary><code>client.planOverrides.<a href="/Sources/Resources/PlanOverrides/PlanOverridesClient.swift">list</a>(customerId: String?, planId: String?, page: Double?, limit: Double?, requestOptions: RequestOptions?) -> PaginatedPlanOverrideResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.planOverrides.list()
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**planId:** `String?` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `Double?` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.planOverrides.<a href="/Sources/Resources/PlanOverrides/PlanOverridesClient.swift">create</a>(request: Requests.CreatePlanOverrideDto, requestOptions: RequestOptions?) -> PlanOverrideResponse</code></summary>
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

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.planOverrides.create(request: .init(
        customerId: "clx_customer_123",
        planId: "clx_plan_456"
    ))
}

try await main()
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Requests.CreatePlanOverrideDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.planOverrides.<a href="/Sources/Resources/PlanOverrides/PlanOverridesClient.swift">get</a>(id: String, requestOptions: RequestOptions?) -> PlanOverrideResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.planOverrides.get(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.planOverrides.<a href="/Sources/Resources/PlanOverrides/PlanOverridesClient.swift">delete</a>(id: String, requestOptions: RequestOptions?) -> Void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.planOverrides.delete(id: "id")
}

try await main()
```
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

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.planOverrides.<a href="/Sources/Resources/PlanOverrides/PlanOverridesClient.swift">update</a>(id: String, request: Requests.UpdatePlanOverrideDto, requestOptions: RequestOptions?) -> PlanOverrideResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```swift
import Foundation
import Api

private func main() async throws {
    let client = NovaBillingClient(token: "<token>")

    _ = try await client.planOverrides.update(
        id: "id",
        request: .init()
    )
}

try await main()
```
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

**request:** `Requests.UpdatePlanOverrideDto` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RequestOptions?` — Additional options for configuring the request, such as custom headers or timeout settings.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

