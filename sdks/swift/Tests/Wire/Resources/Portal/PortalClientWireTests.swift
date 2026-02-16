import Foundation
import Testing
import Api

@Suite("PortalClient Wire Tests") struct PortalClientWireTests {
    @Test func getSubscriptions1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                [
                  {
                    "id": "clx1234567890",
                    "externalId": "ext_sub_123",
                    "customerId": "clxcust123",
                    "planId": "clxplan123",
                    "previousPlanId": "previousPlanId",
                    "status": "ACTIVE",
                    "currency": "USD",
                    "billingTiming": "IN_ADVANCE",
                    "currentPeriodStart": "currentPeriodStart",
                    "currentPeriodEnd": "currentPeriodEnd",
                    "cancelAt": "cancelAt",
                    "canceledAt": "canceledAt",
                    "trialStart": "trialStart",
                    "trialEnd": "trialEnd",
                    "startedAt": "startedAt",
                    "metadata": {
                      "key": "value"
                    },
                    "customer": {
                      "id": "clx1234567890",
                      "name": "Jane Doe",
                      "email": "jane@example.com"
                    },
                    "plan": {
                      "id": "clxplan123",
                      "name": "Premium Monthly",
                      "billingInterval": "HOURLY"
                    },
                    "createdAt": "createdAt",
                    "updatedAt": "updatedAt"
                  }
                ]
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = [
            SubscriptionResponse(
                id: "clx1234567890",
                externalId: Optional("ext_sub_123"),
                customerId: "clxcust123",
                planId: "clxplan123",
                previousPlanId: Optional("previousPlanId"),
                status: .active,
                currency: "USD",
                billingTiming: .inAdvance,
                currentPeriodStart: "currentPeriodStart",
                currentPeriodEnd: "currentPeriodEnd",
                cancelAt: Optional("cancelAt"),
                canceledAt: Optional("canceledAt"),
                trialStart: Optional("trialStart"),
                trialEnd: Optional("trialEnd"),
                startedAt: "startedAt",
                metadata: Optional([
                    "key": JSONValue.string("value")
                ]),
                customer: Optional(SubscriptionCustomerResponse(
                    id: "clx1234567890",
                    name: "Jane Doe",
                    email: "jane@example.com"
                )),
                plan: Optional(SubscriptionPlanResponse(
                    id: "clxplan123",
                    name: "Premium Monthly",
                    billingInterval: .hourly
                )),
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            )
        ]
        let response = try await client.portal.getSubscriptions(
            externalId: "externalId",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getInvoices1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "data": [
                    {
                      "id": "clx1234567890",
                      "invoiceNumber": "INV-2026-0001",
                      "subscriptionId": "subscriptionId",
                      "customerId": "clxcust123",
                      "amount": "99.9900",
                      "currency": "USD",
                      "status": "DRAFT",
                      "dueDate": "dueDate",
                      "paidAt": "paidAt",
                      "pdfUrl": "/uploads/invoices/inv-123.pdf",
                      "metadata": {
                        "key": "value"
                      },
                      "customer": {
                        "id": "clx1234567890",
                        "name": "Jane Doe",
                        "email": "jane@example.com"
                      },
                      "createdAt": "createdAt",
                      "updatedAt": "updatedAt"
                    }
                  ],
                  "meta": {
                    "total": 150,
                    "page": 1,
                    "limit": 20,
                    "totalPages": 8
                  }
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PaginatedInvoiceResponse(
            data: [
                InvoiceResponse(
                    id: "clx1234567890",
                    invoiceNumber: "INV-2026-0001",
                    subscriptionId: Optional("subscriptionId"),
                    customerId: "clxcust123",
                    amount: "99.9900",
                    currency: "USD",
                    status: .draft,
                    dueDate: "dueDate",
                    paidAt: Optional("paidAt"),
                    pdfUrl: Optional("/uploads/invoices/inv-123.pdf"),
                    metadata: Optional([
                        "key": JSONValue.string("value")
                    ]),
                    customer: Optional(InvoiceCustomerResponse(
                        id: "clx1234567890",
                        name: "Jane Doe",
                        email: "jane@example.com"
                    )),
                    createdAt: "createdAt",
                    updatedAt: "updatedAt"
                )
            ],
            meta: PaginationMeta(
                total: 150,
                page: 1,
                limit: 20,
                totalPages: 8
            )
        )
        let response = try await client.portal.getInvoices(
            externalId: "externalId",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func createCheckout1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "checkoutUrl": "https://paystack.com/pay/abc123",
                  "paymentId": "clxpay123",
                  "provider": "paystack",
                  "expiresAt": "expiresAt"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = CheckoutResponse(
            checkoutUrl: "https://paystack.com/pay/abc123",
            paymentId: "clxpay123",
            provider: "paystack",
            expiresAt: "expiresAt"
        )
        let response = try await client.portal.createCheckout(
            externalId: "externalId",
            invoiceId: "invoiceId",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getPayments1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "data": [
                    {
                      "id": "clx1234567890",
                      "invoiceId": "clxinv123",
                      "provider": "paystack",
                      "providerTransactionId": "PAY_txn_abc123",
                      "amount": "99.9900",
                      "currency": "USD",
                      "status": "PENDING",
                      "failureReason": "Insufficient funds",
                      "metadata": {
                        "key": "value"
                      },
                      "createdAt": "createdAt",
                      "updatedAt": "updatedAt"
                    }
                  ],
                  "meta": {
                    "total": 150,
                    "page": 1,
                    "limit": 20,
                    "totalPages": 8
                  }
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PaginatedPaymentResponse(
            data: [
                PaymentResponse(
                    id: "clx1234567890",
                    invoiceId: "clxinv123",
                    provider: "paystack",
                    providerTransactionId: Optional("PAY_txn_abc123"),
                    amount: "99.9900",
                    currency: "USD",
                    status: .pending,
                    failureReason: Optional("Insufficient funds"),
                    metadata: Optional([
                        "key": JSONValue.string("value")
                    ]),
                    createdAt: "createdAt",
                    updatedAt: "updatedAt"
                )
            ],
            meta: PaginationMeta(
                total: 150,
                page: 1,
                limit: 20,
                totalPages: 8
            )
        )
        let response = try await client.portal.getPayments(
            externalId: "externalId",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}