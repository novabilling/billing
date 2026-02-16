import Foundation
import Testing
import Api

@Suite("PaymentMethodsClient Wire Tests") struct PaymentMethodsClientWireTests {
    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "pm_abc123",
                  "customerId": "cus_abc123",
                  "provider": "stripe",
                  "type": "CARD",
                  "tokenId": "pm_1234567890",
                  "isDefault": true,
                  "last4": "4242",
                  "brand": "visa",
                  "expMonth": 12,
                  "expYear": 2028,
                  "cardholderName": "John Doe",
                  "country": "US",
                  "createdAt": "2024-01-15T10:30:00Z",
                  "updatedAt": "2024-01-15T10:30:00Z"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PaymentMethodResponse(
            id: "pm_abc123",
            customerId: "cus_abc123",
            provider: "stripe",
            type: "CARD",
            tokenId: "pm_1234567890",
            isDefault: true,
            last4: Optional("4242"),
            brand: Optional("visa"),
            expMonth: Optional(12),
            expYear: Optional(2028),
            cardholderName: Optional("John Doe"),
            country: Optional("US"),
            createdAt: try! Date("2024-01-15T10:30:00Z", strategy: .iso8601),
            updatedAt: try! Date("2024-01-15T10:30:00Z", strategy: .iso8601)
        )
        let response = try await client.paymentMethods.create(
            request: .init(
                customerId: "cus_abc123",
                provider: "stripe",
                tokenId: "pm_abc123"
            ),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getByCustomer1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                [
                  {
                    "id": "pm_abc123",
                    "customerId": "cus_abc123",
                    "provider": "stripe",
                    "type": "CARD",
                    "tokenId": "pm_1234567890",
                    "isDefault": true,
                    "last4": "4242",
                    "brand": "visa",
                    "expMonth": 12,
                    "expYear": 2028,
                    "cardholderName": "John Doe",
                    "country": "US",
                    "createdAt": "2024-01-15T10:30:00Z",
                    "updatedAt": "2024-01-15T10:30:00Z"
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
            PaymentMethodResponse(
                id: "pm_abc123",
                customerId: "cus_abc123",
                provider: "stripe",
                type: "CARD",
                tokenId: "pm_1234567890",
                isDefault: true,
                last4: Optional("4242"),
                brand: Optional("visa"),
                expMonth: Optional(12),
                expYear: Optional(2028),
                cardholderName: Optional("John Doe"),
                country: Optional("US"),
                createdAt: try! Date("2024-01-15T10:30:00Z", strategy: .iso8601),
                updatedAt: try! Date("2024-01-15T10:30:00Z", strategy: .iso8601)
            )
        ]
        let response = try await client.paymentMethods.getByCustomer(
            customerId: "customerId",
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
                  "id": "pm_abc123",
                  "customerId": "cus_abc123",
                  "provider": "stripe",
                  "type": "CARD",
                  "tokenId": "pm_1234567890",
                  "isDefault": true,
                  "last4": "4242",
                  "brand": "visa",
                  "expMonth": 12,
                  "expYear": 2028,
                  "cardholderName": "John Doe",
                  "country": "US",
                  "createdAt": "2024-01-15T10:30:00Z",
                  "updatedAt": "2024-01-15T10:30:00Z"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PaymentMethodResponse(
            id: "pm_abc123",
            customerId: "cus_abc123",
            provider: "stripe",
            type: "CARD",
            tokenId: "pm_1234567890",
            isDefault: true,
            last4: Optional("4242"),
            brand: Optional("visa"),
            expMonth: Optional(12),
            expYear: Optional(2028),
            cardholderName: Optional("John Doe"),
            country: Optional("US"),
            createdAt: try! Date("2024-01-15T10:30:00Z", strategy: .iso8601),
            updatedAt: try! Date("2024-01-15T10:30:00Z", strategy: .iso8601)
        )
        let response = try await client.paymentMethods.get(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func setDefault1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "pm_abc123",
                  "customerId": "cus_abc123",
                  "provider": "stripe",
                  "type": "CARD",
                  "tokenId": "pm_1234567890",
                  "isDefault": true,
                  "last4": "4242",
                  "brand": "visa",
                  "expMonth": 12,
                  "expYear": 2028,
                  "cardholderName": "John Doe",
                  "country": "US",
                  "createdAt": "2024-01-15T10:30:00Z",
                  "updatedAt": "2024-01-15T10:30:00Z"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PaymentMethodResponse(
            id: "pm_abc123",
            customerId: "cus_abc123",
            provider: "stripe",
            type: "CARD",
            tokenId: "pm_1234567890",
            isDefault: true,
            last4: Optional("4242"),
            brand: Optional("visa"),
            expMonth: Optional(12),
            expYear: Optional(2028),
            cardholderName: Optional("John Doe"),
            country: Optional("US"),
            createdAt: try! Date("2024-01-15T10:30:00Z", strategy: .iso8601),
            updatedAt: try! Date("2024-01-15T10:30:00Z", strategy: .iso8601)
        )
        let response = try await client.paymentMethods.setDefault(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}