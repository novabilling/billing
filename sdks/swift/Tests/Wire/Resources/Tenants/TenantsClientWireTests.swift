import Foundation
import Testing
import Api

@Suite("TenantsClient Wire Tests") struct TenantsClientWireTests {
    @Test func getMe1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "name": "Acme Corp",
                  "slug": "acme-corp",
                  "email": "john@company.com",
                  "apiKey": "sk_live_abc123...",
                  "webhookUrl": "https://example.com/webhooks",
                  "webhookSecret": "whsec_abc123...",
                  "isActive": true,
                  "settings": {
                    "key": "value"
                  },
                  "lastLoginAt": "lastLoginAt",
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
        let expectedResponse = TenantResponse(
            id: "clx1234567890",
            name: "Acme Corp",
            slug: "acme-corp",
            email: "john@company.com",
            apiKey: "sk_live_abc123...",
            webhookUrl: Optional("https://example.com/webhooks"),
            webhookSecret: Optional("whsec_abc123..."),
            isActive: true,
            settings: Optional([
                "key": JSONValue.string("value")
            ]),
            lastLoginAt: Optional("lastLoginAt"),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.tenants.getMe(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func updateMe1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "name": "Acme Corp",
                  "slug": "acme-corp",
                  "email": "john@company.com",
                  "apiKey": "sk_live_abc123...",
                  "webhookUrl": "https://example.com/webhooks",
                  "webhookSecret": "whsec_abc123...",
                  "isActive": true,
                  "settings": {
                    "key": "value"
                  },
                  "lastLoginAt": "lastLoginAt",
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
        let expectedResponse = TenantResponse(
            id: "clx1234567890",
            name: "Acme Corp",
            slug: "acme-corp",
            email: "john@company.com",
            apiKey: "sk_live_abc123...",
            webhookUrl: Optional("https://example.com/webhooks"),
            webhookSecret: Optional("whsec_abc123..."),
            isActive: true,
            settings: Optional([
                "key": JSONValue.string("value")
            ]),
            lastLoginAt: Optional("lastLoginAt"),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.tenants.updateMe(
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getUsage1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "customers": 42,
                  "activeSubscriptions": 15,
                  "totalInvoices": 120,
                  "totalRevenue": "125000.00"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = TenantUsageResponse(
            customers: 42,
            activeSubscriptions: 15,
            totalInvoices: 120,
            totalRevenue: "125000.00"
        )
        let response = try await client.tenants.getUsage(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func testSmtp1() async throws -> Void {
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
        let response = try await client.tenants.testSmtp(
            request: .init(to: "test@example.com"),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}