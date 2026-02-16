import Foundation
import Testing
import Api

@Suite("PaymentsClient Wire Tests") struct PaymentsClientWireTests {
    @Test func list1() async throws -> Void {
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
        let response = try await client.payments.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func paymentsControllerCreate1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PaymentResponse(
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
        let response = try await client.payments.paymentsControllerCreate(
            request: .init(
                invoiceId: "invoiceId",
                provider: "manual",
                amount: 49.99,
                currency: "USD",
                status: .processing
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PaymentResponse(
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
        let response = try await client.payments.get(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func refund1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PaymentResponse(
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
        let response = try await client.payments.refund(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}