import Foundation
import Testing
import Api

@Suite("SubscriptionsClient Wire Tests") struct SubscriptionsClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "data": [
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
        let expectedResponse = PaginatedSubscriptionResponse(
            data: [
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
            ],
            meta: PaginationMeta(
                total: 150,
                page: 1,
                limit: 20,
                totalPages: 8
            )
        )
        let response = try await client.subscriptions.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = SubscriptionResponse(
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
        let response = try await client.subscriptions.create(
            request: .init(
                customerId: "customerId",
                planId: "planId",
                currency: "NGN"
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = SubscriptionResponse(
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
        let response = try await client.subscriptions.get(
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = SubscriptionResponse(
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
        let response = try await client.subscriptions.update(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func cancel1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = SubscriptionResponse(
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
        let response = try await client.subscriptions.cancel(
            id: "id",
            request: .init(cancelAt: .now),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func pause1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = SubscriptionResponse(
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
        let response = try await client.subscriptions.pause(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func resume1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = SubscriptionResponse(
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
        let response = try await client.subscriptions.resume(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func changePlan1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
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
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = SubscriptionResponse(
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
        let response = try await client.subscriptions.changePlan(
            id: "id",
            request: .init(newPlanId: "newPlanId"),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}