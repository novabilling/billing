import Foundation
import Testing
import Api

@Suite("PlanOverridesClient Wire Tests") struct PlanOverridesClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "data": [
                    {
                      "id": "clx1234567890",
                      "customerId": "clx_customer_123",
                      "planId": "clx_plan_456",
                      "overriddenPrices": {
                        "0": {
                          "currency": "USD",
                          "amount": 49.99
                        }
                      },
                      "overriddenMinimumCommitment": 500,
                      "overriddenCharges": {
                        "key": "value"
                      },
                      "metadata": {
                        "key": "value"
                      },
                      "createdAt": "2024-01-15T09:30:00Z",
                      "updatedAt": "2024-01-15T09:30:00Z"
                    }
                  ],
                  "meta": {
                    "key": "value"
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
        let expectedResponse = PaginatedPlanOverrideResponse(
            data: [
                PlanOverrideResponse(
                    id: "clx1234567890",
                    customerId: "clx_customer_123",
                    planId: "clx_plan_456",
                    overriddenPrices: Optional([
                        "0": JSONValue.object(
                            [
                                "currency": JSONValue.string("USD"), 
                                "amount": JSONValue.number(49.99)
                            ]
                        )
                    ]),
                    overriddenMinimumCommitment: Optional(500),
                    overriddenCharges: Optional([
                        "key": JSONValue.string("value")
                    ]),
                    metadata: Optional([
                        "key": JSONValue.string("value")
                    ]),
                    createdAt: try! Date("2024-01-15T09:30:00Z", strategy: .iso8601),
                    updatedAt: try! Date("2024-01-15T09:30:00Z", strategy: .iso8601)
                )
            ],
            meta: [
                "key": JSONValue.string("value")
            ]
        )
        let response = try await client.planOverrides.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "customerId": "clx_customer_123",
                  "planId": "clx_plan_456",
                  "overriddenPrices": {
                    "0": {
                      "currency": "USD",
                      "amount": 49.99
                    }
                  },
                  "overriddenMinimumCommitment": 500,
                  "overriddenCharges": {
                    "key": "value"
                  },
                  "metadata": {
                    "key": "value"
                  },
                  "createdAt": "2024-01-15T09:30:00Z",
                  "updatedAt": "2024-01-15T09:30:00Z"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PlanOverrideResponse(
            id: "clx1234567890",
            customerId: "clx_customer_123",
            planId: "clx_plan_456",
            overriddenPrices: Optional([
                "0": JSONValue.object(
                    [
                        "currency": JSONValue.string("USD"), 
                        "amount": JSONValue.number(49.99)
                    ]
                )
            ]),
            overriddenMinimumCommitment: Optional(500),
            overriddenCharges: Optional([
                "key": JSONValue.string("value")
            ]),
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: try! Date("2024-01-15T09:30:00Z", strategy: .iso8601),
            updatedAt: try! Date("2024-01-15T09:30:00Z", strategy: .iso8601)
        )
        let response = try await client.planOverrides.create(
            request: .init(
                customerId: "clx_customer_123",
                planId: "clx_plan_456"
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
                  "customerId": "clx_customer_123",
                  "planId": "clx_plan_456",
                  "overriddenPrices": {
                    "0": {
                      "currency": "USD",
                      "amount": 49.99
                    }
                  },
                  "overriddenMinimumCommitment": 500,
                  "overriddenCharges": {
                    "key": "value"
                  },
                  "metadata": {
                    "key": "value"
                  },
                  "createdAt": "2024-01-15T09:30:00Z",
                  "updatedAt": "2024-01-15T09:30:00Z"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PlanOverrideResponse(
            id: "clx1234567890",
            customerId: "clx_customer_123",
            planId: "clx_plan_456",
            overriddenPrices: Optional([
                "0": JSONValue.object(
                    [
                        "currency": JSONValue.string("USD"), 
                        "amount": JSONValue.number(49.99)
                    ]
                )
            ]),
            overriddenMinimumCommitment: Optional(500),
            overriddenCharges: Optional([
                "key": JSONValue.string("value")
            ]),
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: try! Date("2024-01-15T09:30:00Z", strategy: .iso8601),
            updatedAt: try! Date("2024-01-15T09:30:00Z", strategy: .iso8601)
        )
        let response = try await client.planOverrides.get(
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
                  "customerId": "clx_customer_123",
                  "planId": "clx_plan_456",
                  "overriddenPrices": {
                    "0": {
                      "currency": "USD",
                      "amount": 49.99
                    }
                  },
                  "overriddenMinimumCommitment": 500,
                  "overriddenCharges": {
                    "key": "value"
                  },
                  "metadata": {
                    "key": "value"
                  },
                  "createdAt": "2024-01-15T09:30:00Z",
                  "updatedAt": "2024-01-15T09:30:00Z"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PlanOverrideResponse(
            id: "clx1234567890",
            customerId: "clx_customer_123",
            planId: "clx_plan_456",
            overriddenPrices: Optional([
                "0": JSONValue.object(
                    [
                        "currency": JSONValue.string("USD"), 
                        "amount": JSONValue.number(49.99)
                    ]
                )
            ]),
            overriddenMinimumCommitment: Optional(500),
            overriddenCharges: Optional([
                "key": JSONValue.string("value")
            ]),
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: try! Date("2024-01-15T09:30:00Z", strategy: .iso8601),
            updatedAt: try! Date("2024-01-15T09:30:00Z", strategy: .iso8601)
        )
        let response = try await client.planOverrides.update(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}