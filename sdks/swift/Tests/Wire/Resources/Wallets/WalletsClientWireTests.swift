import Foundation
import Testing
import Api

@Suite("WalletsClient Wire Tests") struct WalletsClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "data": [
                    {
                      "id": "clx1234567890",
                      "customerId": "clxcust123",
                      "name": "Main Wallet",
                      "currency": "USD",
                      "rateAmount": "1.0000",
                      "creditsBalance": "100.0000",
                      "balance": "100.0000",
                      "consumedCredits": "50.0000",
                      "consumedAmount": "50.0000",
                      "status": "ACTIVE",
                      "expirationAt": "expirationAt",
                      "terminatedAt": "terminatedAt",
                      "customer": {
                        "id": "clx1234567890",
                        "name": "Jane Doe",
                        "email": "jane@example.com"
                      },
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
        let expectedResponse = PaginatedWalletResponse(
            data: [
                WalletResponse(
                    id: "clx1234567890",
                    customerId: "clxcust123",
                    name: Optional("Main Wallet"),
                    currency: "USD",
                    rateAmount: "1.0000",
                    creditsBalance: "100.0000",
                    balance: "100.0000",
                    consumedCredits: "50.0000",
                    consumedAmount: "50.0000",
                    status: .active,
                    expirationAt: Optional("expirationAt"),
                    terminatedAt: Optional("terminatedAt"),
                    customer: Optional(WalletCustomerResponse(
                        id: "clx1234567890",
                        name: "Jane Doe",
                        email: "jane@example.com"
                    )),
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
        let response = try await client.wallets.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "customerId": "clxcust123",
                  "name": "Main Wallet",
                  "currency": "USD",
                  "rateAmount": "1.0000",
                  "creditsBalance": "100.0000",
                  "balance": "100.0000",
                  "consumedCredits": "50.0000",
                  "consumedAmount": "50.0000",
                  "status": "ACTIVE",
                  "expirationAt": "expirationAt",
                  "terminatedAt": "terminatedAt",
                  "customer": {
                    "id": "clx1234567890",
                    "name": "Jane Doe",
                    "email": "jane@example.com"
                  },
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
        let expectedResponse = WalletResponse(
            id: "clx1234567890",
            customerId: "clxcust123",
            name: Optional("Main Wallet"),
            currency: "USD",
            rateAmount: "1.0000",
            creditsBalance: "100.0000",
            balance: "100.0000",
            consumedCredits: "50.0000",
            consumedAmount: "50.0000",
            status: .active,
            expirationAt: Optional("expirationAt"),
            terminatedAt: Optional("terminatedAt"),
            customer: Optional(WalletCustomerResponse(
                id: "clx1234567890",
                name: "Jane Doe",
                email: "jane@example.com"
            )),
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.wallets.create(
            request: .init(
                customerId: "cust_abc123",
                currency: "USD"
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
                  "customerId": "clxcust123",
                  "name": "Main Wallet",
                  "currency": "USD",
                  "rateAmount": "1.0000",
                  "creditsBalance": "100.0000",
                  "balance": "100.0000",
                  "consumedCredits": "50.0000",
                  "consumedAmount": "50.0000",
                  "status": "ACTIVE",
                  "expirationAt": "expirationAt",
                  "terminatedAt": "terminatedAt",
                  "customer": {
                    "id": "clx1234567890",
                    "name": "Jane Doe",
                    "email": "jane@example.com"
                  },
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
        let expectedResponse = WalletResponse(
            id: "clx1234567890",
            customerId: "clxcust123",
            name: Optional("Main Wallet"),
            currency: "USD",
            rateAmount: "1.0000",
            creditsBalance: "100.0000",
            balance: "100.0000",
            consumedCredits: "50.0000",
            consumedAmount: "50.0000",
            status: .active,
            expirationAt: Optional("expirationAt"),
            terminatedAt: Optional("terminatedAt"),
            customer: Optional(WalletCustomerResponse(
                id: "clx1234567890",
                name: "Jane Doe",
                email: "jane@example.com"
            )),
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.wallets.get(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func delete1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "customerId": "clxcust123",
                  "name": "Main Wallet",
                  "currency": "USD",
                  "rateAmount": "1.0000",
                  "creditsBalance": "100.0000",
                  "balance": "100.0000",
                  "consumedCredits": "50.0000",
                  "consumedAmount": "50.0000",
                  "status": "ACTIVE",
                  "expirationAt": "expirationAt",
                  "terminatedAt": "terminatedAt",
                  "customer": {
                    "id": "clx1234567890",
                    "name": "Jane Doe",
                    "email": "jane@example.com"
                  },
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
        let expectedResponse = WalletResponse(
            id: "clx1234567890",
            customerId: "clxcust123",
            name: Optional("Main Wallet"),
            currency: "USD",
            rateAmount: "1.0000",
            creditsBalance: "100.0000",
            balance: "100.0000",
            consumedCredits: "50.0000",
            consumedAmount: "50.0000",
            status: .active,
            expirationAt: Optional("expirationAt"),
            terminatedAt: Optional("terminatedAt"),
            customer: Optional(WalletCustomerResponse(
                id: "clx1234567890",
                name: "Jane Doe",
                email: "jane@example.com"
            )),
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.wallets.delete(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func update1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "customerId": "clxcust123",
                  "name": "Main Wallet",
                  "currency": "USD",
                  "rateAmount": "1.0000",
                  "creditsBalance": "100.0000",
                  "balance": "100.0000",
                  "consumedCredits": "50.0000",
                  "consumedAmount": "50.0000",
                  "status": "ACTIVE",
                  "expirationAt": "expirationAt",
                  "terminatedAt": "terminatedAt",
                  "customer": {
                    "id": "clx1234567890",
                    "name": "Jane Doe",
                    "email": "jane@example.com"
                  },
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
        let expectedResponse = WalletResponse(
            id: "clx1234567890",
            customerId: "clxcust123",
            name: Optional("Main Wallet"),
            currency: "USD",
            rateAmount: "1.0000",
            creditsBalance: "100.0000",
            balance: "100.0000",
            consumedCredits: "50.0000",
            consumedAmount: "50.0000",
            status: .active,
            expirationAt: Optional("expirationAt"),
            terminatedAt: Optional("terminatedAt"),
            customer: Optional(WalletCustomerResponse(
                id: "clx1234567890",
                name: "Jane Doe",
                email: "jane@example.com"
            )),
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.wallets.update(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func createTransaction1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "transactions": [
                    {
                      "id": "clx1234567890",
                      "walletId": "clxwallet123",
                      "transactionType": "INBOUND",
                      "status": "PENDING",
                      "transactionStatus": "PURCHASED",
                      "creditAmount": "50.0000",
                      "amount": "50.0000",
                      "invoiceId": "invoiceId",
                      "settledAt": "settledAt",
                      "metadata": {
                        "key": "value"
                      },
                      "createdAt": "createdAt"
                    }
                  ],
                  "wallet": {
                    "id": "clx1234567890",
                    "customerId": "clxcust123",
                    "name": "Main Wallet",
                    "currency": "USD",
                    "rateAmount": "1.0000",
                    "creditsBalance": "100.0000",
                    "balance": "100.0000",
                    "consumedCredits": "50.0000",
                    "consumedAmount": "50.0000",
                    "status": "ACTIVE",
                    "expirationAt": "expirationAt",
                    "terminatedAt": "terminatedAt",
                    "customer": {
                      "id": "clx1234567890",
                      "name": "Jane Doe",
                      "email": "jane@example.com"
                    },
                    "metadata": {
                      "key": "value"
                    },
                    "createdAt": "createdAt",
                    "updatedAt": "updatedAt"
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
        let expectedResponse = TopUpResponse(
            transactions: [
                WalletTransactionResponse(
                    id: "clx1234567890",
                    walletId: "clxwallet123",
                    transactionType: .inbound,
                    status: .pending,
                    transactionStatus: .purchased,
                    creditAmount: "50.0000",
                    amount: "50.0000",
                    invoiceId: Optional("invoiceId"),
                    settledAt: Optional("settledAt"),
                    metadata: Optional([
                        "key": JSONValue.string("value")
                    ]),
                    createdAt: "createdAt"
                )
            ],
            wallet: WalletResponse(
                id: "clx1234567890",
                customerId: "clxcust123",
                name: Optional("Main Wallet"),
                currency: "USD",
                rateAmount: "1.0000",
                creditsBalance: "100.0000",
                balance: "100.0000",
                consumedCredits: "50.0000",
                consumedAmount: "50.0000",
                status: .active,
                expirationAt: Optional("expirationAt"),
                terminatedAt: Optional("terminatedAt"),
                customer: Optional(WalletCustomerResponse(
                    id: "clx1234567890",
                    name: "Jane Doe",
                    email: "jane@example.com"
                )),
                metadata: Optional([
                    "key": JSONValue.string("value")
                ]),
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            )
        )
        let response = try await client.wallets.createTransaction(
            request: .init(walletId: "wallet_id"),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getTransactions1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "data": [
                    {
                      "id": "clx1234567890",
                      "walletId": "clxwallet123",
                      "transactionType": "INBOUND",
                      "status": "PENDING",
                      "transactionStatus": "PURCHASED",
                      "creditAmount": "50.0000",
                      "amount": "50.0000",
                      "invoiceId": "invoiceId",
                      "settledAt": "settledAt",
                      "metadata": {
                        "key": "value"
                      },
                      "createdAt": "createdAt"
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
        let expectedResponse = PaginatedWalletTransactionResponse(
            data: [
                WalletTransactionResponse(
                    id: "clx1234567890",
                    walletId: "clxwallet123",
                    transactionType: .inbound,
                    status: .pending,
                    transactionStatus: .purchased,
                    creditAmount: "50.0000",
                    amount: "50.0000",
                    invoiceId: Optional("invoiceId"),
                    settledAt: Optional("settledAt"),
                    metadata: Optional([
                        "key": JSONValue.string("value")
                    ]),
                    createdAt: "createdAt"
                )
            ],
            meta: PaginationMeta(
                total: 150,
                page: 1,
                limit: 20,
                totalPages: 8
            )
        )
        let response = try await client.wallets.getTransactions(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}