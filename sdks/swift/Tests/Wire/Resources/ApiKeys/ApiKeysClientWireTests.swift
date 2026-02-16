import Foundation
import Testing
import Api

@Suite("ApiKeysClient Wire Tests") struct ApiKeysClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                [
                  {
                    "id": "clx1234567890",
                    "key": "sk_live_abc123...",
                    "name": "Production API Key",
                    "scopes": [
                      "read",
                      "write"
                    ],
                    "lastUsed": "lastUsed",
                    "expiresAt": "expiresAt",
                    "createdAt": "createdAt"
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
            ApiKeyResponse(
                id: "clx1234567890",
                key: "sk_live_abc123...",
                name: "Production API Key",
                scopes: [
                    "read",
                    "write"
                ],
                lastUsed: Optional("lastUsed"),
                expiresAt: Optional("expiresAt"),
                createdAt: "createdAt"
            )
        ]
        let response = try await client.apiKeys.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "key": "sk_live_abc123...",
                  "name": "Production API Key",
                  "scopes": [
                    "read",
                    "write"
                  ],
                  "lastUsed": "lastUsed",
                  "expiresAt": "expiresAt",
                  "createdAt": "createdAt"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = ApiKeyResponse(
            id: "clx1234567890",
            key: "sk_live_abc123...",
            name: "Production API Key",
            scopes: [
                "read",
                "write"
            ],
            lastUsed: Optional("lastUsed"),
            expiresAt: Optional("expiresAt"),
            createdAt: "createdAt"
        )
        let response = try await client.apiKeys.create(
            request: .init(
                name: "Production API Key",
                scopes: [
                    "read",
                    "write"
                ]
            ),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}