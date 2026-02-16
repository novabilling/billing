import Foundation
import Testing
import Api

@Suite("InvoicesClient Wire Tests") struct InvoicesClientWireTests {
    @Test func list1() async throws -> Void {
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
        let response = try await client.invoices.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = InvoiceResponse(
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
        let response = try await client.invoices.create(
            request: .init(
                customerId: "customerId",
                items: [
                    InvoiceItemDto(
                        description: "Premium Monthly Plan",
                        quantity: 1,
                        unitAmount: 9999.99
                    )
                ],
                dueDate: "2025-02-15"
            ),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func get1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = InvoiceResponse(
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
        let response = try await client.invoices.get(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func finalize1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = InvoiceResponse(
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
        let response = try await client.invoices.finalize(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func void1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = InvoiceResponse(
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
        let response = try await client.invoices.void(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func markPaid1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = InvoiceResponse(
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
        let response = try await client.invoices.markPaid(
            id: "id",
            request: .init(),
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
        let response = try await client.invoices.createCheckout(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func sendEmail1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "message": "Operation completed successfully"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = MessageResponse(
            message: "Operation completed successfully"
        )
        let response = try await client.invoices.sendEmail(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}