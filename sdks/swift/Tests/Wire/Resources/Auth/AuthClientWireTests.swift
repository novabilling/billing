import Foundation
import Testing
import Api

@Suite("AuthClient Wire Tests") struct AuthClientWireTests {
    @Test func register1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
                  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
                  "tenant": {
                    "id": "clx1234567890",
                    "name": "Acme Corp",
                    "slug": "acme-corp",
                    "email": "john@company.com",
                    "apiKey": "sk_live_abc123...",
                    "webhookUrl": "https://example.com/webhooks",
                    "webhookSecret": "webhookSecret",
                    "isActive": true,
                    "settings": {
                      "key": "value"
                    },
                    "lastLoginAt": "lastLoginAt",
                    "createdAt": "createdAt",
                    "updatedAt": "updatedAt"
                  },
                  "apiKey": "sk_live_abc123..."
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = RegisterResponse(
            accessToken: "eyJhbGciOiJIUzI1NiIs...",
            refreshToken: "eyJhbGciOiJIUzI1NiIs...",
            tenant: TenantInfoResponse(
                id: "clx1234567890",
                name: "Acme Corp",
                slug: "acme-corp",
                email: "john@company.com",
                apiKey: "sk_live_abc123...",
                webhookUrl: Optional("https://example.com/webhooks"),
                webhookSecret: Optional("webhookSecret"),
                isActive: true,
                settings: Optional([
                    "key": JSONValue.string("value")
                ]),
                lastLoginAt: Optional("lastLoginAt"),
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            ),
            apiKey: "sk_live_abc123..."
        )
        let response = try await client.auth.register(
            request: .init(
                name: "John Doe",
                email: "john@company.com",
                password: "securePassword123",
                companyName: "Acme Corp"
            ),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func login1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
                  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
                  "tenant": {
                    "id": "clx1234567890",
                    "name": "Acme Corp",
                    "slug": "acme-corp",
                    "email": "john@company.com",
                    "apiKey": "sk_live_abc123...",
                    "webhookUrl": "https://example.com/webhooks",
                    "webhookSecret": "webhookSecret",
                    "isActive": true,
                    "settings": {
                      "key": "value"
                    },
                    "lastLoginAt": "lastLoginAt",
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
        let expectedResponse = LoginResponse(
            accessToken: "eyJhbGciOiJIUzI1NiIs...",
            refreshToken: "eyJhbGciOiJIUzI1NiIs...",
            tenant: TenantInfoResponse(
                id: "clx1234567890",
                name: "Acme Corp",
                slug: "acme-corp",
                email: "john@company.com",
                apiKey: "sk_live_abc123...",
                webhookUrl: Optional("https://example.com/webhooks"),
                webhookSecret: Optional("webhookSecret"),
                isActive: true,
                settings: Optional([
                    "key": JSONValue.string("value")
                ]),
                lastLoginAt: Optional("lastLoginAt"),
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            )
        )
        let response = try await client.auth.login(
            request: .init(
                email: "john@company.com",
                password: "securePassword123"
            ),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func refreshToken1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
                  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = TokenPairResponse(
            accessToken: "eyJhbGciOiJIUzI1NiIs...",
            refreshToken: "eyJhbGciOiJIUzI1NiIs..."
        )
        let response = try await client.auth.refreshToken(
            request: .init(refreshToken: "refreshToken"),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func forgotPassword1() async throws -> Void {
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
        let response = try await client.auth.forgotPassword(
            request: .init(email: "john@company.com"),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func resetPassword1() async throws -> Void {
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
        let response = try await client.auth.resetPassword(
            request: .init(
                token: "token",
                newPassword: "newSecurePassword123"
            ),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}