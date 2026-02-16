import Foundation
import Testing
import Api

@Suite("PaymentProvidersClient Wire Tests") struct PaymentProvidersClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                [
                  {
                    "id": "clx1234567890",
                    "providerName": "paystack",
                    "isActive": true,
                    "priority": 1,
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
            PaymentProviderResponse(
                id: "clx1234567890",
                providerName: "paystack",
                isActive: true,
                priority: 1,
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            )
        ]
        let response = try await client.paymentProviders.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func configure1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "providerName": "paystack",
                  "isActive": true,
                  "priority": 1,
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
        let expectedResponse = PaymentProviderResponse(
            id: "clx1234567890",
            providerName: "paystack",
            isActive: true,
            priority: 1,
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.paymentProviders.configure(
            request: .init(
                providerName: "flutterwave",
                credentials: [
                    "key": .string("value")
                ]
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
                  "providerName": "paystack",
                  "isActive": true,
                  "priority": 1,
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
        let expectedResponse = PaymentProviderResponse(
            id: "clx1234567890",
            providerName: "paystack",
            isActive: true,
            priority: 1,
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.paymentProviders.get(
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
                  "providerName": "paystack",
                  "isActive": true,
                  "priority": 1,
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
        let expectedResponse = PaymentProviderResponse(
            id: "clx1234567890",
            providerName: "paystack",
            isActive: true,
            priority: 1,
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.paymentProviders.delete(
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
                  "providerName": "paystack",
                  "isActive": true,
                  "priority": 1,
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
        let expectedResponse = PaymentProviderResponse(
            id: "clx1234567890",
            providerName: "paystack",
            isActive: true,
            priority: 1,
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.paymentProviders.update(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func testConnection1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "success": true,
                  "message": "Connection successful"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = ProviderTestResponse(
            success: true,
            message: "Connection successful"
        )
        let response = try await client.paymentProviders.testConnection(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}