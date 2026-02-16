# Reference
## Auth
<details><summary><code>client.Auth.Register(request) -> *novabillinggo.RegisterResponse</code></summary>
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

```go
request := &novabillinggo.RegisterDto{
        Name: "John Doe",
        Email: "john@company.com",
        Password: "securePassword123",
        CompanyName: "Acme Corp",
    }
client.Auth.Register(
        context.TODO(),
        request,
    )
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

**name:** `string` — Full name of the tenant owner
    
</dd>
</dl>

<dl>
<dd>

**email:** `string` — Email address
    
</dd>
</dl>

<dl>
<dd>

**password:** `string` — Password (min 8 characters)
    
</dd>
</dl>

<dl>
<dd>

**companyName:** `string` — Company name (used to generate slug)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Auth.Login(request) -> *novabillinggo.LoginResponse</code></summary>
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

```go
request := &novabillinggo.LoginDto{
        Email: "john@company.com",
        Password: "securePassword123",
    }
client.Auth.Login(
        context.TODO(),
        request,
    )
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

**email:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**password:** `string` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Auth.RefreshToken(request) -> *novabillinggo.TokenPairResponse</code></summary>
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

```go
request := &novabillinggo.RefreshTokenDto{
        RefreshToken: "refreshToken",
    }
client.Auth.RefreshToken(
        context.TODO(),
        request,
    )
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

**refreshToken:** `string` — Refresh token
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Auth.ForgotPassword(request) -> *novabillinggo.MessageResponse</code></summary>
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

```go
request := &novabillinggo.ForgotPasswordDto{
        Email: "john@company.com",
    }
client.Auth.ForgotPassword(
        context.TODO(),
        request,
    )
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

**email:** `string` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Auth.ResetPassword(request) -> *novabillinggo.MessageResponse</code></summary>
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

```go
request := &novabillinggo.ResetPasswordDto{
        Token: "token",
        NewPassword: "newSecurePassword123",
    }
client.Auth.ResetPassword(
        context.TODO(),
        request,
    )
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

**token:** `string` — Password reset token
    
</dd>
</dl>

<dl>
<dd>

**newPassword:** `string` — New password (min 8 characters)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Tenants
<details><summary><code>client.Tenants.GetMe() -> *novabillinggo.TenantResponse</code></summary>
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

```go
client.Tenants.GetMe(
        context.TODO(),
    )
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Tenants.UpdateMe(request) -> *novabillinggo.TenantResponse</code></summary>
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

```go
request := &novabillinggo.UpdateTenantDto{}
client.Tenants.UpdateMe(
        context.TODO(),
        request,
    )
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

**name:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**email:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**webhookURL:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**settings:** `map[string]any` — Custom tenant settings (merged with existing)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Tenants.GetUsage() -> *novabillinggo.TenantUsageResponse</code></summary>
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

```go
client.Tenants.GetUsage(
        context.TODO(),
    )
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Tenants.TestSMTP(request) -> *novabillinggo.MessageResponse</code></summary>
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

```go
request := &novabillinggo.TestSMTPTenantsRequest{
        To: "test@example.com",
    }
client.Tenants.TestSMTP(
        context.TODO(),
        request,
    )
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

**to:** `string` — Recipient email address
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## APIKeys
<details><summary><code>client.APIKeys.List() -> []*novabillinggo.APIKeyResponse</code></summary>
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

```go
client.APIKeys.List(
        context.TODO(),
    )
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.APIKeys.Create(request) -> *novabillinggo.APIKeyResponse</code></summary>
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

```go
request := &novabillinggo.CreateAPIKeyBodyDto{
        Name: "Production API Key",
        Scopes: []string{
            "read",
            "write",
        },
    }
client.APIKeys.Create(
        context.TODO(),
        request,
    )
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

**name:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**scopes:** `[]string` 
    
</dd>
</dl>

<dl>
<dd>

**expiresAt:** `*string` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.APIKeys.Delete(ID) -> error</code></summary>
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

```go
request := &novabillinggo.DeleteAPIKeysRequest{
        ID: "id",
    }
client.APIKeys.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` — API key ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Currencies
<details><summary><code>client.Currencies.List() -> []*novabillinggo.CurrencyResponse</code></summary>
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

```go
client.Currencies.List(
        context.TODO(),
    )
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
<details><summary><code>client.Customers.List() -> *novabillinggo.PaginatedCustomerResponse</code></summary>
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

```go
request := &novabillinggo.ListCustomersRequest{}
client.Customers.List(
        context.TODO(),
        request,
    )
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

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**search:** `*string` — Search by name or email
    
</dd>
</dl>

<dl>
<dd>

**country:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**sortBy:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**sortOrder:** `*novabillinggo.ListCustomersRequestSortOrder` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Customers.Create(request) -> *novabillinggo.CustomerResponse</code></summary>
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

```go
request := &novabillinggo.CreateCustomerDto{
        ExternalID: "user_12345",
        Email: "customer@example.com",
        Currency: "NGN",
    }
client.Customers.Create(
        context.TODO(),
        request,
    )
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

**externalID:** `string` — Tenant's user ID
    
</dd>
</dl>

<dl>
<dd>

**email:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**name:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**country:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `string` — ISO currency code
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `map[string]any` — Custom metadata
    
</dd>
</dl>

<dl>
<dd>

**netPaymentTerms:** `*float64` — Net payment terms in days (overrides org and plan defaults)
    
</dd>
</dl>

<dl>
<dd>

**createdAt:** `*string` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Customers.Get(ID) -> *novabillinggo.CustomerResponse</code></summary>
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

```go
request := &novabillinggo.GetCustomersRequest{
        ID: "id",
    }
client.Customers.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Customer ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Customers.Delete(ID) -> error</code></summary>
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

```go
request := &novabillinggo.DeleteCustomersRequest{
        ID: "id",
    }
client.Customers.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` — Customer ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Customers.Update(ID, request) -> *novabillinggo.CustomerResponse</code></summary>
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

```go
request := &novabillinggo.UpdateCustomerDto{
        ID: "id",
    }
client.Customers.Update(
        context.TODO(),
        request,
    )
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

**id:** `string` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**externalID:** `*string` — Tenant's user ID
    
</dd>
</dl>

<dl>
<dd>

**email:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**name:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**country:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `*string` — ISO currency code
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `map[string]any` — Custom metadata
    
</dd>
</dl>

<dl>
<dd>

**netPaymentTerms:** `*float64` — Net payment terms in days (overrides org and plan defaults)
    
</dd>
</dl>

<dl>
<dd>

**createdAt:** `*string` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Customers.GetSubscriptions(ID) -> []*novabillinggo.SubscriptionResponse</code></summary>
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

```go
request := &novabillinggo.GetSubscriptionsCustomersRequest{
        ID: "id",
    }
client.Customers.GetSubscriptions(
        context.TODO(),
        request,
    )
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

**id:** `string` — Customer ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Customers.GetInvoices(ID) -> []*novabillinggo.InvoiceResponse</code></summary>
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

```go
request := &novabillinggo.GetInvoicesCustomersRequest{
        ID: "id",
    }
client.Customers.GetInvoices(
        context.TODO(),
        request,
    )
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

**id:** `string` — Customer ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Customers.GetPayments(ID) -> []*novabillinggo.PaymentResponse</code></summary>
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

```go
request := &novabillinggo.GetPaymentsCustomersRequest{
        ID: "id",
    }
client.Customers.GetPayments(
        context.TODO(),
        request,
    )
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

**id:** `string` — Customer ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Customers.GetPaymentMethods(ID) -> error</code></summary>
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

```go
request := &novabillinggo.GetPaymentMethodsCustomersRequest{
        ID: "id",
    }
client.Customers.GetPaymentMethods(
        context.TODO(),
        request,
    )
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

**id:** `string` — Customer ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Customers.AddPaymentMethod(ID) -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.AddPaymentMethodCustomersRequest{
        ID: "id",
    }
client.Customers.AddPaymentMethod(
        context.TODO(),
        request,
    )
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

**id:** `string` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Customers.DeletePaymentMethod(ID, MethodID) -> error</code></summary>
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

```go
request := &novabillinggo.DeletePaymentMethodCustomersRequest{
        ID: "id",
        MethodID: "methodId",
    }
client.Customers.DeletePaymentMethod(
        context.TODO(),
        request,
    )
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

**id:** `string` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**methodID:** `string` — Payment method ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Plans
<details><summary><code>client.Plans.List() -> []*novabillinggo.PlanResponse</code></summary>
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

```go
request := &novabillinggo.ListPlansRequest{}
client.Plans.List(
        context.TODO(),
        request,
    )
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

**isActive:** `*bool` — Filter by active status
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Plans.Create(request) -> *novabillinggo.PlanResponse</code></summary>
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

```go
request := &novabillinggo.CreatePlanDto{
        Name: "Premium Monthly",
        Code: "premium_monthly",
        BillingInterval: novabillinggo.CreatePlanDtoBillingIntervalHourly,
    }
client.Plans.Create(
        context.TODO(),
        request,
    )
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

**name:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**code:** `string` — Unique plan code (lowercase, underscores)
    
</dd>
</dl>

<dl>
<dd>

**description:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**billingInterval:** `*novabillinggo.CreatePlanDtoBillingInterval` 
    
</dd>
</dl>

<dl>
<dd>

**billingTiming:** `*novabillinggo.CreatePlanDtoBillingTiming` — When to charge: IN_ADVANCE (at period start) or IN_ARREARS (at period end). Defaults to IN_ARREARS.
    
</dd>
</dl>

<dl>
<dd>

**features:** `[]string` 
    
</dd>
</dl>

<dl>
<dd>

**prices:** `[]*novabillinggo.CreatePlanPriceDto` 
    
</dd>
</dl>

<dl>
<dd>

**netPaymentTerms:** `*float64` — Net payment terms in days (overrides org default)
    
</dd>
</dl>

<dl>
<dd>

**invoiceGracePeriodDays:** `*float64` — Grace period in days before draft invoices are finalized
    
</dd>
</dl>

<dl>
<dd>

**progressiveBillingThreshold:** `*float64` — Usage cost threshold for mid-cycle progressive billing invoices
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Plans.Get(ID) -> *novabillinggo.PlanResponse</code></summary>
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

```go
request := &novabillinggo.GetPlansRequest{
        ID: "id",
    }
client.Plans.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Plan ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Plans.Delete(ID) -> *novabillinggo.PlanResponse</code></summary>
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

```go
request := &novabillinggo.DeletePlansRequest{
        ID: "id",
    }
client.Plans.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` — Plan ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Plans.Update(ID, request) -> *novabillinggo.PlanResponse</code></summary>
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

```go
request := &novabillinggo.UpdatePlanDto{
        ID: "id",
    }
client.Plans.Update(
        context.TODO(),
        request,
    )
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

**id:** `string` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**billingInterval:** `*novabillinggo.UpdatePlanDtoBillingInterval` 
    
</dd>
</dl>

<dl>
<dd>

**billingTiming:** `*novabillinggo.UpdatePlanDtoBillingTiming` — When to charge: IN_ADVANCE or IN_ARREARS
    
</dd>
</dl>

<dl>
<dd>

**features:** `[]string` 
    
</dd>
</dl>

<dl>
<dd>

**isActive:** `*bool` 
    
</dd>
</dl>

<dl>
<dd>

**netPaymentTerms:** `*float64` — Net payment terms in days
    
</dd>
</dl>

<dl>
<dd>

**invoiceGracePeriodDays:** `*float64` — Grace period in days before draft invoices are finalized
    
</dd>
</dl>

<dl>
<dd>

**progressiveBillingThreshold:** `*float64` — Usage cost threshold for progressive billing
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Plans.AddPrice(ID, request) -> *novabillinggo.PlanPriceResponse</code></summary>
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

```go
request := &novabillinggo.AddPricePlansRequest{
        ID: "id",
        Body: &novabillinggo.CreatePlanPriceDto{
            Currency: "NGN",
            Amount: 9999.99,
        },
    }
client.Plans.AddPrice(
        context.TODO(),
        request,
    )
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

**id:** `string` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `*novabillinggo.CreatePlanPriceDto` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Plans.DeletePrice(ID, PriceID) -> *novabillinggo.PlanPriceResponse</code></summary>
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

```go
request := &novabillinggo.DeletePricePlansRequest{
        ID: "id",
        PriceID: "priceId",
    }
client.Plans.DeletePrice(
        context.TODO(),
        request,
    )
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

**id:** `string` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**priceID:** `string` — Price ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Plans.UpdatePrice(ID, PriceID) -> *novabillinggo.PlanPriceResponse</code></summary>
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

```go
request := &novabillinggo.UpdatePricePlansRequest{
        ID: "id",
        PriceID: "priceId",
    }
client.Plans.UpdatePrice(
        context.TODO(),
        request,
    )
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

**id:** `string` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**priceID:** `string` — Price ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Subscriptions
<details><summary><code>client.Subscriptions.List() -> *novabillinggo.PaginatedSubscriptionResponse</code></summary>
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

```go
request := &novabillinggo.ListSubscriptionsRequest{}
client.Subscriptions.List(
        context.TODO(),
        request,
    )
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

**status:** `*string` — Filter by status (ACTIVE, TRIALING, PAUSED, CANCELED)
    
</dd>
</dl>

<dl>
<dd>

**customerID:** `*string` — Filter by customer ID
    
</dd>
</dl>

<dl>
<dd>

**planID:** `*string` — Filter by plan ID
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Subscriptions.Create(request) -> *novabillinggo.SubscriptionResponse</code></summary>
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

```go
request := &novabillinggo.CreateSubscriptionDto{
        CustomerID: "customerId",
        PlanID: "planId",
        Currency: "NGN",
    }
client.Subscriptions.Create(
        context.TODO(),
        request,
    )
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

**customerID:** `string` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**planID:** `string` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**currency:** `string` — Currency for billing
    
</dd>
</dl>

<dl>
<dd>

**trialDays:** `*float64` — Number of trial days
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `map[string]any` 
    
</dd>
</dl>

<dl>
<dd>

**startDate:** `*string` — Override subscription start date (ISO 8601). Defaults to now.
    
</dd>
</dl>

<dl>
<dd>

**currentPeriodEnd:** `*string` — Override current period end (ISO 8601). Defaults to calculated from startDate + billing interval.
    
</dd>
</dl>

<dl>
<dd>

**status:** `*novabillinggo.CreateSubscriptionDtoStatus` — Override subscription status for imports
    
</dd>
</dl>

<dl>
<dd>

**createdAt:** `*string` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>

<dl>
<dd>

**externalID:** `*string` — External ID for linking to external systems
    
</dd>
</dl>

<dl>
<dd>

**canceledAt:** `*string` — Canceled at date (ISO 8601). For importing canceled subscriptions.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Subscriptions.Get(ID) -> *novabillinggo.SubscriptionResponse</code></summary>
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

```go
request := &novabillinggo.GetSubscriptionsRequest{
        ID: "id",
    }
client.Subscriptions.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Subscription ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Subscriptions.Update(ID, request) -> *novabillinggo.SubscriptionResponse</code></summary>
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

```go
request := &novabillinggo.UpdateSubscriptionDto{
        ID: "id",
    }
client.Subscriptions.Update(
        context.TODO(),
        request,
    )
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

**id:** `string` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `map[string]any` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Subscriptions.Cancel(ID, request) -> *novabillinggo.SubscriptionResponse</code></summary>
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

```go
request := &novabillinggo.CancelSubscriptionDto{
        ID: "id",
        CancelAt: novabillinggo.CancelSubscriptionDtoCancelAtNow,
    }
client.Subscriptions.Cancel(
        context.TODO(),
        request,
    )
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

**id:** `string` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**cancelAt:** `*novabillinggo.CancelSubscriptionDtoCancelAt` — When to cancel: immediately or at end of current period
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Subscriptions.Pause(ID) -> *novabillinggo.SubscriptionResponse</code></summary>
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

```go
request := &novabillinggo.PauseSubscriptionsRequest{
        ID: "id",
    }
client.Subscriptions.Pause(
        context.TODO(),
        request,
    )
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

**id:** `string` — Subscription ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Subscriptions.Resume(ID) -> *novabillinggo.SubscriptionResponse</code></summary>
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

```go
request := &novabillinggo.ResumeSubscriptionsRequest{
        ID: "id",
    }
client.Subscriptions.Resume(
        context.TODO(),
        request,
    )
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

**id:** `string` — Subscription ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Subscriptions.ChangePlan(ID, request) -> *novabillinggo.SubscriptionResponse</code></summary>
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

```go
request := &novabillinggo.ChangePlanDto{
        ID: "id",
        NewPlanID: "newPlanId",
    }
client.Subscriptions.ChangePlan(
        context.TODO(),
        request,
    )
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

**id:** `string` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**newPlanID:** `string` — New plan ID
    
</dd>
</dl>

<dl>
<dd>

**prorate:** `*bool` — Whether to prorate charges
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Invoices
<details><summary><code>client.Invoices.List() -> *novabillinggo.PaginatedInvoiceResponse</code></summary>
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

```go
request := &novabillinggo.ListInvoicesRequest{}
client.Invoices.List(
        context.TODO(),
        request,
    )
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

**status:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**customerID:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**dateFrom:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Invoices.Create(request) -> *novabillinggo.InvoiceResponse</code></summary>
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

```go
request := &novabillinggo.CreateInvoiceDto{
        CustomerID: "customerId",
        Items: []*novabillinggo.InvoiceItemDto{
            &novabillinggo.InvoiceItemDto{
                Description: "Premium Monthly Plan",
                Quantity: 1,
                UnitAmount: 9999.99,
            },
        },
        DueDate: "2025-02-15",
    }
client.Invoices.Create(
        context.TODO(),
        request,
    )
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

**customerID:** `string` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**subscriptionID:** `*string` — Subscription ID (optional)
    
</dd>
</dl>

<dl>
<dd>

**items:** `[]*novabillinggo.InvoiceItemDto` 
    
</dd>
</dl>

<dl>
<dd>

**dueDate:** `string` — Due date
    
</dd>
</dl>

<dl>
<dd>

**status:** `*novabillinggo.CreateInvoiceDtoStatus` — Override invoice status for imports
    
</dd>
</dl>

<dl>
<dd>

**invoiceNumber:** `*string` — Override invoice number (e.g. INV-00042). Auto-generated if omitted.
    
</dd>
</dl>

<dl>
<dd>

**currency:** `*string` — Currency override (defaults to customer currency)
    
</dd>
</dl>

<dl>
<dd>

**paidAt:** `*string` — Paid at date (ISO 8601). For importing paid invoices.
    
</dd>
</dl>

<dl>
<dd>

**createdAt:** `*string` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Invoices.Get(ID) -> *novabillinggo.InvoiceResponse</code></summary>
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

```go
request := &novabillinggo.GetInvoicesRequest{
        ID: "id",
    }
client.Invoices.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Invoice ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Invoices.Finalize(ID) -> *novabillinggo.InvoiceResponse</code></summary>
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

```go
request := &novabillinggo.FinalizeInvoicesRequest{
        ID: "id",
    }
client.Invoices.Finalize(
        context.TODO(),
        request,
    )
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

**id:** `string` — Invoice ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Invoices.Void(ID) -> *novabillinggo.InvoiceResponse</code></summary>
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

```go
request := &novabillinggo.VoidInvoicesRequest{
        ID: "id",
    }
client.Invoices.Void(
        context.TODO(),
        request,
    )
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

**id:** `string` — Invoice ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Invoices.MarkPaid(ID, request) -> *novabillinggo.InvoiceResponse</code></summary>
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

```go
request := &novabillinggo.MarkPaidInvoicesRequest{
        ID: "id",
    }
client.Invoices.MarkPaid(
        context.TODO(),
        request,
    )
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

**id:** `string` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**paymentMethod:** `*string` — Payment method used (cash, bank_transfer, check, manual). Defaults to "manual".
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Invoices.CreateCheckout(ID, request) -> *novabillinggo.CheckoutResponse</code></summary>
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

```go
request := &novabillinggo.CreateCheckoutInvoicesRequest{
        ID: "id",
    }
client.Invoices.CreateCheckout(
        context.TODO(),
        request,
    )
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

**id:** `string` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**callbackURL:** `*string` — URL to redirect customer after payment
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Invoices.SendEmail(ID, request) -> *novabillinggo.MessageResponse</code></summary>
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

```go
request := &novabillinggo.SendEmailInvoicesRequest{
        ID: "id",
    }
client.Invoices.SendEmail(
        context.TODO(),
        request,
    )
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

**id:** `string` — Invoice ID
    
</dd>
</dl>

<dl>
<dd>

**email:** `*string` — Recipient email address. Defaults to the customer email if omitted.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Invoices.GetPdf(ID) -> error</code></summary>
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

```go
request := &novabillinggo.GetPdfInvoicesRequest{
        ID: "id",
    }
client.Invoices.GetPdf(
        context.TODO(),
        request,
    )
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

**id:** `string` — Invoice ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Payments
<details><summary><code>client.Payments.List() -> *novabillinggo.PaginatedPaymentResponse</code></summary>
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

```go
request := &novabillinggo.ListPaymentsRequest{}
client.Payments.List(
        context.TODO(),
        request,
    )
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

**status:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**provider:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**invoiceID:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**dateFrom:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Payments.PaymentsControllerCreate(request) -> *novabillinggo.PaymentResponse</code></summary>
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

```go
request := &novabillinggo.CreatePaymentDto{
        InvoiceID: "invoiceId",
        Provider: "manual",
        Amount: 49.99,
        Currency: "USD",
        Status: novabillinggo.CreatePaymentDtoStatusProcessing,
    }
client.Payments.PaymentsControllerCreate(
        context.TODO(),
        request,
    )
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

**invoiceID:** `string` — Invoice ID this payment is for
    
</dd>
</dl>

<dl>
<dd>

**provider:** `string` — Payment provider name (e.g. stripe, paystack, manual)
    
</dd>
</dl>

<dl>
<dd>

**amount:** `float64` — Payment amount
    
</dd>
</dl>

<dl>
<dd>

**currency:** `string` — Currency
    
</dd>
</dl>

<dl>
<dd>

**status:** `*novabillinggo.CreatePaymentDtoStatus` — Payment status
    
</dd>
</dl>

<dl>
<dd>

**providerTransactionID:** `*string` — Provider transaction ID
    
</dd>
</dl>

<dl>
<dd>

**failureReason:** `*string` — Failure reason (for FAILED payments)
    
</dd>
</dl>

<dl>
<dd>

**createdAt:** `*string` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Payments.Get(ID) -> *novabillinggo.PaymentResponse</code></summary>
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

```go
request := &novabillinggo.GetPaymentsRequest{
        ID: "id",
    }
client.Payments.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Payment ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Payments.Refund(ID, request) -> *novabillinggo.PaymentResponse</code></summary>
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

```go
request := &novabillinggo.RefundPaymentDto{
        ID: "id",
    }
client.Payments.Refund(
        context.TODO(),
        request,
    )
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

**id:** `string` — Payment ID
    
</dd>
</dl>

<dl>
<dd>

**amount:** `*float64` — Amount to refund (full refund if omitted)
    
</dd>
</dl>

<dl>
<dd>

**reason:** `*string` — Reason for refund
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Payment Providers
<details><summary><code>client.PaymentProviders.List() -> []*novabillinggo.PaymentProviderResponse</code></summary>
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

```go
client.PaymentProviders.List(
        context.TODO(),
    )
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PaymentProviders.Configure(request) -> *novabillinggo.PaymentProviderResponse</code></summary>
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

```go
request := &novabillinggo.CreateProviderDto{
        ProviderName: "flutterwave",
        Credentials: map[string]any{
            "key": "value",
        },
    }
client.PaymentProviders.Configure(
        context.TODO(),
        request,
    )
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

**providerName:** `string` — Provider name
    
</dd>
</dl>

<dl>
<dd>

**credentials:** `map[string]any` — Provider credentials (will be encrypted)
    
</dd>
</dl>

<dl>
<dd>

**isActive:** `*bool` 
    
</dd>
</dl>

<dl>
<dd>

**priority:** `*float64` — Priority (lower = higher)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PaymentProviders.Get(ID) -> *novabillinggo.PaymentProviderResponse</code></summary>
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

```go
request := &novabillinggo.GetPaymentProvidersRequest{
        ID: "id",
    }
client.PaymentProviders.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Payment provider ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PaymentProviders.Delete(ID) -> *novabillinggo.PaymentProviderResponse</code></summary>
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

```go
request := &novabillinggo.DeletePaymentProvidersRequest{
        ID: "id",
    }
client.PaymentProviders.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` — Payment provider ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PaymentProviders.Update(ID, request) -> *novabillinggo.PaymentProviderResponse</code></summary>
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

```go
request := &novabillinggo.UpdateProviderDto{
        ID: "id",
    }
client.PaymentProviders.Update(
        context.TODO(),
        request,
    )
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

**id:** `string` — Payment provider ID
    
</dd>
</dl>

<dl>
<dd>

**providerName:** `*string` — Provider name
    
</dd>
</dl>

<dl>
<dd>

**credentials:** `map[string]any` — Provider credentials (will be encrypted)
    
</dd>
</dl>

<dl>
<dd>

**isActive:** `*bool` 
    
</dd>
</dl>

<dl>
<dd>

**priority:** `*float64` — Priority (lower = higher)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PaymentProviders.TestConnection(ID) -> *novabillinggo.ProviderTestResponse</code></summary>
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

```go
request := &novabillinggo.TestConnectionPaymentProvidersRequest{
        ID: "id",
    }
client.PaymentProviders.TestConnection(
        context.TODO(),
        request,
    )
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

**id:** `string` — Payment provider ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Webhooks
<details><summary><code>client.Webhooks.WebhooksControllerPaystack() -> error</code></summary>
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

```go
request := &novabillinggo.WebhooksControllerPaystackRequest{
        PaystackSignature: "x-paystack-signature",
    }
client.Webhooks.WebhooksControllerPaystack(
        context.TODO(),
        request,
    )
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

**paystackSignature:** `string` — Paystack HMAC-SHA512 signature
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Webhooks.WebhooksControllerFlutterwave() -> error</code></summary>
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

```go
request := &novabillinggo.WebhooksControllerFlutterwaveRequest{}
client.Webhooks.WebhooksControllerFlutterwave(
        context.TODO(),
        request,
    )
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

**verifHash:** `*string` — Flutterwave verification hash
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Webhooks.WebhooksControllerDpo() -> error</code></summary>
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

```go
client.Webhooks.WebhooksControllerDpo(
        context.TODO(),
    )
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Webhooks.WebhooksControllerPayu() -> error</code></summary>
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

```go
client.Webhooks.WebhooksControllerPayu(
        context.TODO(),
    )
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Webhooks.WebhooksControllerPesapal() -> error</code></summary>
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

```go
client.Webhooks.WebhooksControllerPesapal(
        context.TODO(),
    )
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Webhooks.WebhooksControllerStripe() -> error</code></summary>
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

```go
request := &novabillinggo.WebhooksControllerStripeRequest{
        StripeSignature: "stripe-signature",
    }
client.Webhooks.WebhooksControllerStripe(
        context.TODO(),
        request,
    )
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

**stripeSignature:** `string` — Stripe webhook signature
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Analytics
<details><summary><code>client.Analytics.GetRevenue() -> *novabillinggo.RevenueAnalyticsResponse</code></summary>
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

```go
request := &novabillinggo.GetRevenueAnalyticsRequest{
        DateFrom: novabillinggo.String(
            "2025-01-01",
        ),
        DateTo: novabillinggo.String(
            "2025-12-31",
        ),
    }
client.Analytics.GetRevenue(
        context.TODO(),
        request,
    )
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

**dateFrom:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `*novabillinggo.GetRevenueAnalyticsRequestGroupBy` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Analytics.GetSubscriptions() -> *novabillinggo.SubscriptionAnalyticsResponse</code></summary>
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

```go
request := &novabillinggo.GetSubscriptionsAnalyticsRequest{
        DateFrom: novabillinggo.String(
            "2025-01-01",
        ),
        DateTo: novabillinggo.String(
            "2025-12-31",
        ),
    }
client.Analytics.GetSubscriptions(
        context.TODO(),
        request,
    )
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

**dateFrom:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `*novabillinggo.GetSubscriptionsAnalyticsRequestGroupBy` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Analytics.GetCustomers() -> *novabillinggo.CustomerAnalyticsResponse</code></summary>
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

```go
request := &novabillinggo.GetCustomersAnalyticsRequest{
        DateFrom: novabillinggo.String(
            "2025-01-01",
        ),
        DateTo: novabillinggo.String(
            "2025-12-31",
        ),
    }
client.Analytics.GetCustomers(
        context.TODO(),
        request,
    )
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

**dateFrom:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `*novabillinggo.GetCustomersAnalyticsRequestGroupBy` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Analytics.GetPayments() -> *novabillinggo.PaymentAnalyticsResponse</code></summary>
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

```go
request := &novabillinggo.GetPaymentsAnalyticsRequest{
        DateFrom: novabillinggo.String(
            "2025-01-01",
        ),
        DateTo: novabillinggo.String(
            "2025-12-31",
        ),
    }
client.Analytics.GetPayments(
        context.TODO(),
        request,
    )
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

**dateFrom:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `*novabillinggo.GetPaymentsAnalyticsRequestGroupBy` 
    
</dd>
</dl>

<dl>
<dd>

**provider:** `*string` — Filter by payment provider name
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Analytics.GetMrrBreakdown() -> *novabillinggo.MrrBreakdownResponse</code></summary>
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

```go
request := &novabillinggo.GetMrrBreakdownAnalyticsRequest{
        DateFrom: novabillinggo.String(
            "2025-01-01",
        ),
        DateTo: novabillinggo.String(
            "2025-12-31",
        ),
    }
client.Analytics.GetMrrBreakdown(
        context.TODO(),
        request,
    )
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

**dateFrom:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `*novabillinggo.GetMrrBreakdownAnalyticsRequestGroupBy` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Analytics.GetNetRevenue() -> *novabillinggo.NetRevenueResponse</code></summary>
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

```go
request := &novabillinggo.GetNetRevenueAnalyticsRequest{
        DateFrom: novabillinggo.String(
            "2025-01-01",
        ),
        DateTo: novabillinggo.String(
            "2025-12-31",
        ),
    }
client.Analytics.GetNetRevenue(
        context.TODO(),
        request,
    )
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

**dateFrom:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**dateTo:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**groupBy:** `*novabillinggo.GetNetRevenueAnalyticsRequestGroupBy` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Analytics.GetChurnCohorts() -> *novabillinggo.ChurnCohortsResponse</code></summary>
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

```go
request := &novabillinggo.GetChurnCohortsAnalyticsRequest{}
client.Analytics.GetChurnCohorts(
        context.TODO(),
        request,
    )
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

**months:** `*float64` — Number of months to analyze (default 12)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Analytics.GetLifetimeValue() -> *novabillinggo.LtvResponse</code></summary>
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

```go
client.Analytics.GetLifetimeValue(
        context.TODO(),
    )
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
<details><summary><code>client.Coupons.List() -> *novabillinggo.PaginatedCouponResponse</code></summary>
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

```go
request := &novabillinggo.ListCouponsRequest{}
client.Coupons.List(
        context.TODO(),
        request,
    )
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

**isActive:** `*bool` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Coupons.Create(request) -> *novabillinggo.CouponResponse</code></summary>
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

```go
request := &novabillinggo.CreateCouponDto{
        Code: "WELCOME20",
        Name: "20% Welcome Discount",
        DiscountType: novabillinggo.CreateCouponDtoDiscountTypePercentage,
        DiscountValue: 20,
    }
client.Coupons.Create(
        context.TODO(),
        request,
    )
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

**code:** `string` — Unique coupon code
    
</dd>
</dl>

<dl>
<dd>

**name:** `string` — Display name
    
</dd>
</dl>

<dl>
<dd>

**description:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**discountType:** `*novabillinggo.CreateCouponDtoDiscountType` 
    
</dd>
</dl>

<dl>
<dd>

**discountValue:** `float64` — Discount value (percentage 0-100 or fixed amount)
    
</dd>
</dl>

<dl>
<dd>

**currency:** `*string` — Currency for FIXED_AMOUNT discounts
    
</dd>
</dl>

<dl>
<dd>

**maxRedemptions:** `*float64` — Max number of redemptions (null = unlimited)
    
</dd>
</dl>

<dl>
<dd>

**appliesToPlanIDs:** `[]string` — Plan IDs this coupon applies to (empty = all)
    
</dd>
</dl>

<dl>
<dd>

**expiresAt:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**createdAt:** `*string` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Coupons.Get(ID) -> *novabillinggo.CouponResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.GetCouponsRequest{
        ID: "id",
    }
client.Coupons.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Coupon ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Coupons.Delete(ID) -> *novabillinggo.CouponResponse</code></summary>
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

```go
request := &novabillinggo.DeleteCouponsRequest{
        ID: "id",
    }
client.Coupons.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` — Coupon ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Coupons.Update(ID, request) -> *novabillinggo.CouponResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.UpdateCouponDto{
        ID: "id",
    }
client.Coupons.Update(
        context.TODO(),
        request,
    )
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

**id:** `string` — Coupon ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**isActive:** `*bool` 
    
</dd>
</dl>

<dl>
<dd>

**expiresAt:** `*string` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Coupons.Apply(request) -> *novabillinggo.AppliedCouponResponse</code></summary>
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

```go
request := &novabillinggo.ApplyCouponDto{
        CouponID: "couponId",
        CustomerID: "customerId",
    }
client.Coupons.Apply(
        context.TODO(),
        request,
    )
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

**couponID:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**customerID:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**subscriptionID:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**usesRemaining:** `*float64` — Number of billing cycles to apply (null = forever)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Coupons.RemoveApplied(ID) -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.RemoveAppliedCouponsRequest{
        ID: "id",
    }
client.Coupons.RemoveApplied(
        context.TODO(),
        request,
    )
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

**id:** `string` — Applied coupon ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## AddOns
<details><summary><code>client.AddOns.List() -> *novabillinggo.PaginatedAddOnResponse</code></summary>
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

```go
request := &novabillinggo.ListAddOnsRequest{}
client.AddOns.List(
        context.TODO(),
        request,
    )
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

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.AddOns.Create(request) -> *novabillinggo.AddOnResponse</code></summary>
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

```go
request := &novabillinggo.CreateAddOnDto{
        Name: "Premium Support",
        Code: "premium_support",
        Prices: []*novabillinggo.AddOnPriceDto{
            &novabillinggo.AddOnPriceDto{
                Currency: "UGX",
                Amount: 50000,
            },
        },
    }
client.AddOns.Create(
        context.TODO(),
        request,
    )
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

**name:** `string` — Display name
    
</dd>
</dl>

<dl>
<dd>

**code:** `string` — Unique code for the add-on
    
</dd>
</dl>

<dl>
<dd>

**description:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**invoiceDisplayName:** `*string` — Custom name shown on invoices
    
</dd>
</dl>

<dl>
<dd>

**prices:** `[]*novabillinggo.AddOnPriceDto` — Prices in different currencies
    
</dd>
</dl>

<dl>
<dd>

**createdAt:** `*string` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.AddOns.Get(ID) -> *novabillinggo.AddOnResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.GetAddOnsRequest{
        ID: "id",
    }
client.AddOns.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Add-on ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.AddOns.Delete(ID) -> *novabillinggo.AddOnResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.DeleteAddOnsRequest{
        ID: "id",
    }
client.AddOns.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` — Add-on ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.AddOns.Update(ID, request) -> *novabillinggo.AddOnResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.UpdateAddOnDto{
        ID: "id",
    }
client.AddOns.Update(
        context.TODO(),
        request,
    )
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

**id:** `string` — Add-on ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**invoiceDisplayName:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**prices:** `[]*novabillinggo.AddOnPriceDto` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.AddOns.Apply(request) -> *novabillinggo.AppliedAddOnResponse</code></summary>
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

```go
request := &novabillinggo.ApplyAddOnDto{
        AddOnID: "addOnId",
        CustomerID: "customerId",
        Amount: 50000,
        Currency: "UGX",
    }
client.AddOns.Apply(
        context.TODO(),
        request,
    )
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

**addOnID:** `string` — Add-on ID
    
</dd>
</dl>

<dl>
<dd>

**customerID:** `string` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**subscriptionID:** `*string` — Subscription to attach the charge to
    
</dd>
</dl>

<dl>
<dd>

**amount:** `float64` — Charge amount
    
</dd>
</dl>

<dl>
<dd>

**currency:** `string` — Currency
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.AddOns.ListApplied() -> []*novabillinggo.AppliedAddOnResponse</code></summary>
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

```go
request := &novabillinggo.ListAppliedAddOnsRequest{}
client.AddOns.ListApplied(
        context.TODO(),
        request,
    )
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

**customerID:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**invoiced:** `*bool` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.AddOns.RemoveApplied(ID) -> *novabillinggo.AppliedAddOnResponse</code></summary>
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

```go
request := &novabillinggo.RemoveAppliedAddOnsRequest{
        ID: "id",
    }
client.AddOns.RemoveApplied(
        context.TODO(),
        request,
    )
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

**id:** `string` — Applied add-on ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## CreditNotes
<details><summary><code>client.CreditNotes.List() -> *novabillinggo.PaginatedCreditNoteResponse</code></summary>
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

```go
request := &novabillinggo.ListCreditNotesRequest{}
client.CreditNotes.List(
        context.TODO(),
        request,
    )
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

**customerID:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**invoiceID:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**status:** `*novabillinggo.ListCreditNotesRequestStatus` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.CreditNotes.Create(request) -> *novabillinggo.CreditNoteResponse</code></summary>
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

```go
request := &novabillinggo.CreateCreditNoteDto{
        InvoiceID: "invoiceId",
        CustomerID: "customerId",
        Amount: 25000,
        Currency: "UGX",
        Reason: novabillinggo.CreateCreditNoteDtoReasonDuplicate,
    }
client.CreditNotes.Create(
        context.TODO(),
        request,
    )
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

**invoiceID:** `string` — Invoice ID to credit against
    
</dd>
</dl>

<dl>
<dd>

**customerID:** `string` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**amount:** `float64` — Credit amount
    
</dd>
</dl>

<dl>
<dd>

**currency:** `string` — Currency
    
</dd>
</dl>

<dl>
<dd>

**reason:** `*novabillinggo.CreateCreditNoteDtoReason` 
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `map[string]any` — Additional metadata
    
</dd>
</dl>

<dl>
<dd>

**status:** `*novabillinggo.CreateCreditNoteDtoStatus` — Override status for imports
    
</dd>
</dl>

<dl>
<dd>

**createdAt:** `*string` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.CreditNotes.Get(ID) -> *novabillinggo.CreditNoteResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.GetCreditNotesRequest{
        ID: "id",
    }
client.CreditNotes.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Credit note ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.CreditNotes.CreditNotesControllerUpdate(ID, request) -> *novabillinggo.CreditNoteResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.UpdateCreditNoteDto{
        ID: "id",
    }
client.CreditNotes.CreditNotesControllerUpdate(
        context.TODO(),
        request,
    )
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

**id:** `string` — Credit note ID
    
</dd>
</dl>

<dl>
<dd>

**amount:** `*float64` — Updated amount
    
</dd>
</dl>

<dl>
<dd>

**reason:** `*novabillinggo.UpdateCreditNoteDtoReason` 
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `map[string]any` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.CreditNotes.Finalize(ID) -> *novabillinggo.CreditNoteResponse</code></summary>
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

```go
request := &novabillinggo.FinalizeCreditNotesRequest{
        ID: "id",
    }
client.CreditNotes.Finalize(
        context.TODO(),
        request,
    )
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

**id:** `string` — Credit note ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.CreditNotes.Void(ID) -> *novabillinggo.CreditNoteResponse</code></summary>
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

```go
request := &novabillinggo.VoidCreditNotesRequest{
        ID: "id",
    }
client.CreditNotes.Void(
        context.TODO(),
        request,
    )
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

**id:** `string` — Credit note ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Portal
<details><summary><code>client.Portal.GetBilling(ExternalID) -> error</code></summary>
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

```go
request := &novabillinggo.GetBillingPortalRequest{
        ExternalID: "externalId",
    }
client.Portal.GetBilling(
        context.TODO(),
        request,
    )
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

**externalID:** `string` — Customer external ID (your app user ID)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Portal.GetSubscriptions(ExternalID) -> []*novabillinggo.SubscriptionResponse</code></summary>
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

```go
request := &novabillinggo.GetSubscriptionsPortalRequest{
        ExternalID: "externalId",
    }
client.Portal.GetSubscriptions(
        context.TODO(),
        request,
    )
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

**externalID:** `string` — Customer external ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Portal.GetInvoices(ExternalID) -> *novabillinggo.PaginatedInvoiceResponse</code></summary>
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

```go
request := &novabillinggo.GetInvoicesPortalRequest{
        ExternalID: "externalId",
    }
client.Portal.GetInvoices(
        context.TODO(),
        request,
    )
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

**externalID:** `string` — Customer external ID
    
</dd>
</dl>

<dl>
<dd>

**status:** `*novabillinggo.GetInvoicesPortalRequestStatus` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Portal.CreateCheckout(ExternalID, InvoiceID) -> *novabillinggo.CheckoutResponse</code></summary>
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

```go
request := &novabillinggo.CreateCheckoutPortalRequest{
        ExternalID: "externalId",
        InvoiceID: "invoiceId",
    }
client.Portal.CreateCheckout(
        context.TODO(),
        request,
    )
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

**externalID:** `string` — Customer external ID
    
</dd>
</dl>

<dl>
<dd>

**invoiceID:** `string` — Invoice ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Portal.GetPayments(ExternalID) -> *novabillinggo.PaginatedPaymentResponse</code></summary>
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

```go
request := &novabillinggo.GetPaymentsPortalRequest{
        ExternalID: "externalId",
    }
client.Portal.GetPayments(
        context.TODO(),
        request,
    )
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

**externalID:** `string` — Customer external ID
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## BillableMetrics
<details><summary><code>client.BillableMetrics.List() -> []*novabillinggo.BillableMetricResponse</code></summary>
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

```go
client.BillableMetrics.List(
        context.TODO(),
    )
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.BillableMetrics.Create(request) -> *novabillinggo.BillableMetricResponse</code></summary>
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

```go
request := &novabillinggo.CreateBillableMetricDto{
        Name: "API Calls",
        Code: "api_calls",
        AggregationType: novabillinggo.CreateBillableMetricDtoAggregationTypeCount,
    }
client.BillableMetrics.Create(
        context.TODO(),
        request,
    )
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

**name:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**code:** `string` — Unique metric code
    
</dd>
</dl>

<dl>
<dd>

**description:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**aggregationType:** `*novabillinggo.CreateBillableMetricDtoAggregationType` 
    
</dd>
</dl>

<dl>
<dd>

**fieldName:** `*string` — Property key to aggregate (required for SUM, MAX, LATEST, WEIGHTED_SUM)
    
</dd>
</dl>

<dl>
<dd>

**recurring:** `*bool` — If true, value carries forward across billing periods
    
</dd>
</dl>

<dl>
<dd>

**filters:** `[]*novabillinggo.CreateBillableMetricFilterDto` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.BillableMetrics.Get(ID) -> *novabillinggo.BillableMetricResponse</code></summary>
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

```go
request := &novabillinggo.GetBillableMetricsRequest{
        ID: "id",
    }
client.BillableMetrics.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Billable Metric ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.BillableMetrics.Delete(ID) -> *novabillinggo.BillableMetricResponse</code></summary>
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

```go
request := &novabillinggo.DeleteBillableMetricsRequest{
        ID: "id",
    }
client.BillableMetrics.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` — Billable Metric ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.BillableMetrics.Update(ID, request) -> *novabillinggo.BillableMetricResponse</code></summary>
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

```go
request := &novabillinggo.UpdateBillableMetricDto{
        ID: "id",
    }
client.BillableMetrics.Update(
        context.TODO(),
        request,
    )
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

**id:** `string` — Billable Metric ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**fieldName:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**recurring:** `*bool` 
    
</dd>
</dl>

<dl>
<dd>

**filters:** `[]*novabillinggo.CreateBillableMetricFilterDto` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Events
<details><summary><code>client.Events.List() -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
client.Events.List(
        context.TODO(),
    )
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Events.Create(request) -> *novabillinggo.UsageEventResponse</code></summary>
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

```go
request := &novabillinggo.CreateEventDto{
        TransactionID: "evt_12345",
        SubscriptionID: "sub_abc123",
        Code: "api_calls",
    }
client.Events.Create(
        context.TODO(),
        request,
    )
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

**request:** `*novabillinggo.CreateEventDto` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Events.CreateBatch(request) -> *novabillinggo.BatchEventResponse</code></summary>
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

```go
request := &novabillinggo.BatchEventsDto{
        Events: []*novabillinggo.CreateEventDto{
            &novabillinggo.CreateEventDto{
                TransactionID: "evt_12345",
                SubscriptionID: "sub_abc123",
                Code: "api_calls",
            },
        },
    }
client.Events.CreateBatch(
        context.TODO(),
        request,
    )
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

**events:** `[]*novabillinggo.CreateEventDto` — Array of events to ingest (max 100)
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Events.Get(ID) -> *novabillinggo.UsageEventResponse</code></summary>
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

```go
request := &novabillinggo.GetEventsRequest{
        ID: "id",
    }
client.Events.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Event ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Events.GetBySubscription(SubscriptionID) -> *novabillinggo.PaginatedUsageEventResponse</code></summary>
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

```go
request := &novabillinggo.GetBySubscriptionEventsRequest{
        SubscriptionID: "subscriptionId",
    }
client.Events.GetBySubscription(
        context.TODO(),
        request,
    )
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

**subscriptionID:** `string` — Subscription ID
    
</dd>
</dl>

<dl>
<dd>

**code:** `*string` — Filter by metric code
    
</dd>
</dl>

<dl>
<dd>

**from:** `*string` — Start date (ISO 8601)
    
</dd>
</dl>

<dl>
<dd>

**to:** `*string` — End date (ISO 8601)
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**perPage:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Charges
<details><summary><code>client.Charges.List() -> []*novabillinggo.ChargeResponse</code></summary>
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

```go
request := &novabillinggo.ListChargesRequest{}
client.Charges.List(
        context.TODO(),
        request,
    )
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

**planID:** `*string` — Filter by plan ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Charges.Create(request) -> *novabillinggo.ChargeResponse</code></summary>
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

```go
request := &novabillinggo.CreateChargeDto{
        PlanID: "planId",
        BillableMetricID: "billableMetricId",
        ChargeModel: novabillinggo.CreateChargeDtoChargeModelStandard,
    }
client.Charges.Create(
        context.TODO(),
        request,
    )
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

**planID:** `string` — Plan ID to attach this charge to
    
</dd>
</dl>

<dl>
<dd>

**billableMetricID:** `string` — Billable metric ID
    
</dd>
</dl>

<dl>
<dd>

**chargeModel:** `*novabillinggo.CreateChargeDtoChargeModel` 
    
</dd>
</dl>

<dl>
<dd>

**billingTiming:** `*novabillinggo.CreateChargeDtoBillingTiming` 
    
</dd>
</dl>

<dl>
<dd>

**invoiceDisplayName:** `*string` — Display name on invoices
    
</dd>
</dl>

<dl>
<dd>

**minAmountCents:** `*float64` — Minimum charge in cents
    
</dd>
</dl>

<dl>
<dd>

**prorated:** `*bool` 
    
</dd>
</dl>

<dl>
<dd>

**properties:** `map[string]any` — Model-specific config. Standard: { amount, currency }. Package: { amount, packageSize, currency }. Percentage: { rate, fixedAmount, freeUnitsPerEvent, freeUnitsPerTotalAggregation }
    
</dd>
</dl>

<dl>
<dd>

**graduatedRanges:** `[]*novabillinggo.GraduatedRangeDto` — Required for GRADUATED and VOLUME charge models
    
</dd>
</dl>

<dl>
<dd>

**filters:** `[]*novabillinggo.ChargeFilterDto` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Charges.Get(ID) -> *novabillinggo.ChargeResponse</code></summary>
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

```go
request := &novabillinggo.GetChargesRequest{
        ID: "id",
    }
client.Charges.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Charge ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Charges.Delete(ID) -> *novabillinggo.ChargeResponse</code></summary>
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

```go
request := &novabillinggo.DeleteChargesRequest{
        ID: "id",
    }
client.Charges.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` — Charge ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Charges.Update(ID, request) -> *novabillinggo.ChargeResponse</code></summary>
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

```go
request := &novabillinggo.UpdateChargeDto{
        ID: "id",
    }
client.Charges.Update(
        context.TODO(),
        request,
    )
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

**id:** `string` — Charge ID
    
</dd>
</dl>

<dl>
<dd>

**billingTiming:** `*novabillinggo.UpdateChargeDtoBillingTiming` 
    
</dd>
</dl>

<dl>
<dd>

**invoiceDisplayName:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**minAmountCents:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**prorated:** `*bool` 
    
</dd>
</dl>

<dl>
<dd>

**properties:** `map[string]any` 
    
</dd>
</dl>

<dl>
<dd>

**graduatedRanges:** `[]*novabillinggo.GraduatedRangeDto` 
    
</dd>
</dl>

<dl>
<dd>

**filters:** `[]*novabillinggo.ChargeFilterDto` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Charges.GetByPlan(PlanID) -> []*novabillinggo.ChargeResponse</code></summary>
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

```go
request := &novabillinggo.GetByPlanChargesRequest{
        PlanID: "planId",
    }
client.Charges.GetByPlan(
        context.TODO(),
        request,
    )
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

**planID:** `string` — Plan ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Wallets
<details><summary><code>client.Wallets.List() -> *novabillinggo.PaginatedWalletResponse</code></summary>
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

```go
request := &novabillinggo.ListWalletsRequest{}
client.Wallets.List(
        context.TODO(),
        request,
    )
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

**customerID:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**status:** `*novabillinggo.ListWalletsRequestStatus` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Wallets.Create(request) -> *novabillinggo.WalletResponse</code></summary>
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

```go
request := &novabillinggo.CreateWalletDto{
        CustomerID: "cust_abc123",
        Currency: "USD",
    }
client.Wallets.Create(
        context.TODO(),
        request,
    )
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

**customerID:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**name:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**currency:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**rateAmount:** `*float64` — 1 credit = rateAmount in currency
    
</dd>
</dl>

<dl>
<dd>

**paidCredits:** `*float64` — Paid credits (purchase)
    
</dd>
</dl>

<dl>
<dd>

**grantedCredits:** `*float64` — Free credits (grant)
    
</dd>
</dl>

<dl>
<dd>

**expirationAt:** `*string` — Expiration date (ISO 8601)
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `map[string]any` 
    
</dd>
</dl>

<dl>
<dd>

**createdAt:** `*string` — Backdate createdAt (ISO 8601). For data imports.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Wallets.Get(ID) -> *novabillinggo.WalletResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.GetWalletsRequest{
        ID: "id",
    }
client.Wallets.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Wallet ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Wallets.Delete(ID) -> *novabillinggo.WalletResponse</code></summary>
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

```go
request := &novabillinggo.DeleteWalletsRequest{
        ID: "id",
    }
client.Wallets.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` — Wallet ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Wallets.Update(ID, request) -> *novabillinggo.WalletResponse</code></summary>
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

```go
request := &novabillinggo.UpdateWalletDto{
        ID: "id",
    }
client.Wallets.Update(
        context.TODO(),
        request,
    )
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

**id:** `string` — Wallet ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**expirationAt:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `map[string]any` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Wallets.CreateTransaction(request) -> *novabillinggo.TopUpResponse</code></summary>
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

```go
request := &novabillinggo.TopUpWalletDto{
        WalletID: "wallet_id",
    }
client.Wallets.CreateTransaction(
        context.TODO(),
        request,
    )
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

**walletID:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**paidCredits:** `*float64` — Paid credits to purchase
    
</dd>
</dl>

<dl>
<dd>

**grantedCredits:** `*float64` — Free credits to grant
    
</dd>
</dl>

<dl>
<dd>

**voidedCredits:** `*float64` — Credits to void
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `map[string]any` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Wallets.GetTransactions(ID) -> *novabillinggo.PaginatedWalletTransactionResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.GetTransactionsWalletsRequest{
        ID: "id",
    }
client.Wallets.GetTransactions(
        context.TODO(),
        request,
    )
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

**id:** `string` — Wallet ID
    
</dd>
</dl>

<dl>
<dd>

**status:** `*novabillinggo.GetTransactionsWalletsRequestStatus` 
    
</dd>
</dl>

<dl>
<dd>

**transactionStatus:** `*novabillinggo.GetTransactionsWalletsRequestTransactionStatus` 
    
</dd>
</dl>

<dl>
<dd>

**transactionType:** `*novabillinggo.GetTransactionsWalletsRequestTransactionType` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## PaymentMethods
<details><summary><code>client.PaymentMethods.List() -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
client.PaymentMethods.List(
        context.TODO(),
    )
}
```
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PaymentMethods.Create(request) -> *novabillinggo.PaymentMethodResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.CreatePaymentMethodDto{
        CustomerID: "cus_abc123",
        Provider: "stripe",
        TokenID: "pm_abc123",
    }
client.PaymentMethods.Create(
        context.TODO(),
        request,
    )
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

**customerID:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**provider:** `string` — Payment provider (stripe, paystack, flutterwave, dpo, payu, pesapal)
    
</dd>
</dl>

<dl>
<dd>

**type_:** `*novabillinggo.CreatePaymentMethodDtoType` 
    
</dd>
</dl>

<dl>
<dd>

**tokenID:** `string` — Provider-specific token/payment method ID
    
</dd>
</dl>

<dl>
<dd>

**last4:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**brand:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**expMonth:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**expYear:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**cardholderName:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**country:** `*string` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PaymentMethods.GetByCustomer(CustomerID) -> []*novabillinggo.PaymentMethodResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.GetByCustomerPaymentMethodsRequest{
        CustomerID: "customerId",
    }
client.PaymentMethods.GetByCustomer(
        context.TODO(),
        request,
    )
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

**customerID:** `string` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PaymentMethods.Get(ID) -> *novabillinggo.PaymentMethodResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.GetPaymentMethodsRequest{
        ID: "id",
    }
client.PaymentMethods.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PaymentMethods.Delete(ID) -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.DeletePaymentMethodsRequest{
        ID: "id",
    }
client.PaymentMethods.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PaymentMethods.SetDefault(ID) -> *novabillinggo.PaymentMethodResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.SetDefaultPaymentMethodsRequest{
        ID: "id",
    }
client.PaymentMethods.SetDefault(
        context.TODO(),
        request,
    )
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

**id:** `string` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Taxes
<details><summary><code>client.Taxes.List() -> *novabillinggo.PaginatedTaxResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.ListTaxesRequest{}
client.Taxes.List(
        context.TODO(),
        request,
    )
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

**appliedByDefault:** `*bool` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.Create(request) -> *novabillinggo.TaxResponse</code></summary>
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

```go
request := &novabillinggo.CreateTaxDto{
        Name: "VAT",
        Code: "vat_18",
        Rate: 18,
    }
client.Taxes.Create(
        context.TODO(),
        request,
    )
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

**name:** `string` — Tax name
    
</dd>
</dl>

<dl>
<dd>

**code:** `string` — Unique tax code (lowercase, underscores)
    
</dd>
</dl>

<dl>
<dd>

**rate:** `float64` — Tax rate as a percentage (e.g., 18 for 18%)
    
</dd>
</dl>

<dl>
<dd>

**description:** `*string` — Tax description
    
</dd>
</dl>

<dl>
<dd>

**appliedByDefault:** `*bool` — Whether this tax is applied by default to all invoices
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.Get(ID) -> *novabillinggo.TaxResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.GetTaxesRequest{
        ID: "id",
    }
client.Taxes.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Tax ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.Delete(ID) -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.DeleteTaxesRequest{
        ID: "id",
    }
client.Taxes.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` — Tax ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.Update(ID, request) -> *novabillinggo.TaxResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.UpdateTaxDto{
        ID: "id",
    }
client.Taxes.Update(
        context.TODO(),
        request,
    )
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

**id:** `string` — Tax ID
    
</dd>
</dl>

<dl>
<dd>

**name:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**rate:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**description:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**appliedByDefault:** `*bool` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.TaxesControllerGetCustomerTaxes(CustomerID) -> []*novabillinggo.TaxResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.TaxesControllerGetCustomerTaxesRequest{
        CustomerID: "customerId",
    }
client.Taxes.TaxesControllerGetCustomerTaxes(
        context.TODO(),
        request,
    )
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

**customerID:** `string` — Customer ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.AssignToCustomer(CustomerID, request) -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.AssignToCustomerTaxesRequest{
        CustomerID: "customerId",
        Body: &novabillinggo.AssignTaxDto{
            TaxID: "clx1234567890",
        },
    }
client.Taxes.AssignToCustomer(
        context.TODO(),
        request,
    )
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

**customerID:** `string` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `*novabillinggo.AssignTaxDto` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.RemoveFromCustomer(CustomerID, TaxID) -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.RemoveFromCustomerTaxesRequest{
        CustomerID: "customerId",
        TaxID: "taxId",
    }
client.Taxes.RemoveFromCustomer(
        context.TODO(),
        request,
    )
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

**customerID:** `string` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**taxID:** `string` — Tax ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.TaxesControllerGetPlanTaxes(PlanID) -> []*novabillinggo.TaxResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.TaxesControllerGetPlanTaxesRequest{
        PlanID: "planId",
    }
client.Taxes.TaxesControllerGetPlanTaxes(
        context.TODO(),
        request,
    )
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

**planID:** `string` — Plan ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.AssignToPlan(PlanID, request) -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.AssignToPlanTaxesRequest{
        PlanID: "planId",
        Body: &novabillinggo.AssignTaxDto{
            TaxID: "clx1234567890",
        },
    }
client.Taxes.AssignToPlan(
        context.TODO(),
        request,
    )
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

**planID:** `string` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `*novabillinggo.AssignTaxDto` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.RemoveFromPlan(PlanID, TaxID) -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.RemoveFromPlanTaxesRequest{
        PlanID: "planId",
        TaxID: "taxId",
    }
client.Taxes.RemoveFromPlan(
        context.TODO(),
        request,
    )
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

**planID:** `string` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**taxID:** `string` — Tax ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.AssignToCharge(ChargeID, request) -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.AssignToChargeTaxesRequest{
        ChargeID: "chargeId",
        Body: &novabillinggo.AssignTaxDto{
            TaxID: "clx1234567890",
        },
    }
client.Taxes.AssignToCharge(
        context.TODO(),
        request,
    )
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

**chargeID:** `string` — Charge ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `*novabillinggo.AssignTaxDto` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.Taxes.RemoveFromCharge(ChargeID, TaxID) -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.RemoveFromChargeTaxesRequest{
        ChargeID: "chargeId",
        TaxID: "taxId",
    }
client.Taxes.RemoveFromCharge(
        context.TODO(),
        request,
    )
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

**chargeID:** `string` — Charge ID
    
</dd>
</dl>

<dl>
<dd>

**taxID:** `string` — Tax ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## PlanOverrides
<details><summary><code>client.PlanOverrides.List() -> *novabillinggo.PaginatedPlanOverrideResponse</code></summary>
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

```go
request := &novabillinggo.ListPlanOverridesRequest{}
client.PlanOverrides.List(
        context.TODO(),
        request,
    )
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

**customerID:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**planID:** `*string` 
    
</dd>
</dl>

<dl>
<dd>

**page:** `*float64` 
    
</dd>
</dl>

<dl>
<dd>

**limit:** `*float64` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PlanOverrides.Create(request) -> *novabillinggo.PlanOverrideResponse</code></summary>
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

```go
request := &novabillinggo.CreatePlanOverrideDto{
        CustomerID: "clx_customer_123",
        PlanID: "clx_plan_456",
    }
client.PlanOverrides.Create(
        context.TODO(),
        request,
    )
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

**customerID:** `string` — Customer ID
    
</dd>
</dl>

<dl>
<dd>

**planID:** `string` — Plan ID
    
</dd>
</dl>

<dl>
<dd>

**overriddenPrices:** `[]string` — Override plan prices: array of { currency, amount }
    
</dd>
</dl>

<dl>
<dd>

**overriddenMinimumCommitment:** `*float64` — Override minimum commitment amount
    
</dd>
</dl>

<dl>
<dd>

**overriddenCharges:** `[]string` — Override charge properties: array of { chargeId, properties?, graduatedRanges? }
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `map[string]any` — Custom metadata
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PlanOverrides.Get(ID) -> *novabillinggo.PlanOverrideResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.GetPlanOverridesRequest{
        ID: "id",
    }
client.PlanOverrides.Get(
        context.TODO(),
        request,
    )
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

**id:** `string` — Plan override ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PlanOverrides.Delete(ID) -> error</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.DeletePlanOverridesRequest{
        ID: "id",
    }
client.PlanOverrides.Delete(
        context.TODO(),
        request,
    )
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

**id:** `string` — Plan override ID
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.PlanOverrides.Update(ID, request) -> *novabillinggo.PlanOverrideResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```go
request := &novabillinggo.UpdatePlanOverrideDto{
        ID: "id",
    }
client.PlanOverrides.Update(
        context.TODO(),
        request,
    )
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

**id:** `string` — Plan override ID
    
</dd>
</dl>

<dl>
<dd>

**overriddenPrices:** `[]string` — Override plan prices
    
</dd>
</dl>

<dl>
<dd>

**overriddenMinimumCommitment:** `*float64` — Override minimum commitment amount
    
</dd>
</dl>

<dl>
<dd>

**overriddenCharges:** `[]string` — Override charge properties
    
</dd>
</dl>

<dl>
<dd>

**metadata:** `map[string]any` — Custom metadata
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>
