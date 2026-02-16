import Foundation
import Testing
import Api

@Suite("PlansClient Wire Tests") struct PlansClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                [
                  {
                    "id": "clx1234567890",
                    "name": "Premium Monthly",
                    "code": "premium_monthly",
                    "description": "Premium plan with all features",
                    "billingInterval": "HOURLY",
                    "features": [
                      "Unlimited users",
                      "Priority support"
                    ],
                    "isActive": true,
                    "billingTiming": "IN_ADVANCE",
                    "minimumCommitment": "100.0000",
                    "prices": [
                      {
                        "id": "clx1234567890",
                        "planId": "clxplan123",
                        "currency": "USD",
                        "amount": "49.9900",
                        "isActive": true,
                        "createdAt": "createdAt",
                        "updatedAt": "updatedAt"
                      }
                    ],
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
            PlanResponse(
                id: "clx1234567890",
                name: "Premium Monthly",
                code: "premium_monthly",
                description: Optional("Premium plan with all features"),
                billingInterval: .hourly,
                features: Optional([
                    "Unlimited users",
                    "Priority support"
                ]),
                isActive: true,
                billingTiming: .inAdvance,
                minimumCommitment: Optional("100.0000"),
                prices: [
                    PlanPriceResponse(
                        id: "clx1234567890",
                        planId: "clxplan123",
                        currency: "USD",
                        amount: "49.9900",
                        isActive: true,
                        createdAt: "createdAt",
                        updatedAt: "updatedAt"
                    )
                ],
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            )
        ]
        let response = try await client.plans.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "name": "Premium Monthly",
                  "code": "premium_monthly",
                  "description": "Premium plan with all features",
                  "billingInterval": "HOURLY",
                  "features": [
                    "Unlimited users",
                    "Priority support"
                  ],
                  "isActive": true,
                  "billingTiming": "IN_ADVANCE",
                  "minimumCommitment": "100.0000",
                  "prices": [
                    {
                      "id": "clx1234567890",
                      "planId": "clxplan123",
                      "currency": "USD",
                      "amount": "49.9900",
                      "isActive": true,
                      "createdAt": "createdAt",
                      "updatedAt": "updatedAt"
                    }
                  ],
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
        let expectedResponse = PlanResponse(
            id: "clx1234567890",
            name: "Premium Monthly",
            code: "premium_monthly",
            description: Optional("Premium plan with all features"),
            billingInterval: .hourly,
            features: Optional([
                "Unlimited users",
                "Priority support"
            ]),
            isActive: true,
            billingTiming: .inAdvance,
            minimumCommitment: Optional("100.0000"),
            prices: [
                PlanPriceResponse(
                    id: "clx1234567890",
                    planId: "clxplan123",
                    currency: "USD",
                    amount: "49.9900",
                    isActive: true,
                    createdAt: "createdAt",
                    updatedAt: "updatedAt"
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.plans.create(
            request: .init(
                name: "Premium Monthly",
                code: "premium_monthly",
                billingInterval: .hourly
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
                  "name": "Premium Monthly",
                  "code": "premium_monthly",
                  "description": "Premium plan with all features",
                  "billingInterval": "HOURLY",
                  "features": [
                    "Unlimited users",
                    "Priority support"
                  ],
                  "isActive": true,
                  "billingTiming": "IN_ADVANCE",
                  "minimumCommitment": "100.0000",
                  "prices": [
                    {
                      "id": "clx1234567890",
                      "planId": "clxplan123",
                      "currency": "USD",
                      "amount": "49.9900",
                      "isActive": true,
                      "createdAt": "createdAt",
                      "updatedAt": "updatedAt"
                    }
                  ],
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
        let expectedResponse = PlanResponse(
            id: "clx1234567890",
            name: "Premium Monthly",
            code: "premium_monthly",
            description: Optional("Premium plan with all features"),
            billingInterval: .hourly,
            features: Optional([
                "Unlimited users",
                "Priority support"
            ]),
            isActive: true,
            billingTiming: .inAdvance,
            minimumCommitment: Optional("100.0000"),
            prices: [
                PlanPriceResponse(
                    id: "clx1234567890",
                    planId: "clxplan123",
                    currency: "USD",
                    amount: "49.9900",
                    isActive: true,
                    createdAt: "createdAt",
                    updatedAt: "updatedAt"
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.plans.get(
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
                  "name": "Premium Monthly",
                  "code": "premium_monthly",
                  "description": "Premium plan with all features",
                  "billingInterval": "HOURLY",
                  "features": [
                    "Unlimited users",
                    "Priority support"
                  ],
                  "isActive": true,
                  "billingTiming": "IN_ADVANCE",
                  "minimumCommitment": "100.0000",
                  "prices": [
                    {
                      "id": "clx1234567890",
                      "planId": "clxplan123",
                      "currency": "USD",
                      "amount": "49.9900",
                      "isActive": true,
                      "createdAt": "createdAt",
                      "updatedAt": "updatedAt"
                    }
                  ],
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
        let expectedResponse = PlanResponse(
            id: "clx1234567890",
            name: "Premium Monthly",
            code: "premium_monthly",
            description: Optional("Premium plan with all features"),
            billingInterval: .hourly,
            features: Optional([
                "Unlimited users",
                "Priority support"
            ]),
            isActive: true,
            billingTiming: .inAdvance,
            minimumCommitment: Optional("100.0000"),
            prices: [
                PlanPriceResponse(
                    id: "clx1234567890",
                    planId: "clxplan123",
                    currency: "USD",
                    amount: "49.9900",
                    isActive: true,
                    createdAt: "createdAt",
                    updatedAt: "updatedAt"
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.plans.delete(
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
                  "name": "Premium Monthly",
                  "code": "premium_monthly",
                  "description": "Premium plan with all features",
                  "billingInterval": "HOURLY",
                  "features": [
                    "Unlimited users",
                    "Priority support"
                  ],
                  "isActive": true,
                  "billingTiming": "IN_ADVANCE",
                  "minimumCommitment": "100.0000",
                  "prices": [
                    {
                      "id": "clx1234567890",
                      "planId": "clxplan123",
                      "currency": "USD",
                      "amount": "49.9900",
                      "isActive": true,
                      "createdAt": "createdAt",
                      "updatedAt": "updatedAt"
                    }
                  ],
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
        let expectedResponse = PlanResponse(
            id: "clx1234567890",
            name: "Premium Monthly",
            code: "premium_monthly",
            description: Optional("Premium plan with all features"),
            billingInterval: .hourly,
            features: Optional([
                "Unlimited users",
                "Priority support"
            ]),
            isActive: true,
            billingTiming: .inAdvance,
            minimumCommitment: Optional("100.0000"),
            prices: [
                PlanPriceResponse(
                    id: "clx1234567890",
                    planId: "clxplan123",
                    currency: "USD",
                    amount: "49.9900",
                    isActive: true,
                    createdAt: "createdAt",
                    updatedAt: "updatedAt"
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.plans.update(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func addPrice1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "planId": "clxplan123",
                  "currency": "USD",
                  "amount": "49.9900",
                  "isActive": true,
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
        let expectedResponse = PlanPriceResponse(
            id: "clx1234567890",
            planId: "clxplan123",
            currency: "USD",
            amount: "49.9900",
            isActive: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.plans.addPrice(
            id: "id",
            request: .init(body: CreatePlanPriceDto(
                currency: "NGN",
                amount: 9999.99
            )),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func deletePrice1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "planId": "clxplan123",
                  "currency": "USD",
                  "amount": "49.9900",
                  "isActive": true,
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
        let expectedResponse = PlanPriceResponse(
            id: "clx1234567890",
            planId: "clxplan123",
            currency: "USD",
            amount: "49.9900",
            isActive: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.plans.deletePrice(
            id: "id",
            priceId: "priceId",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func updatePrice1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "planId": "clxplan123",
                  "currency": "USD",
                  "amount": "49.9900",
                  "isActive": true,
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
        let expectedResponse = PlanPriceResponse(
            id: "clx1234567890",
            planId: "clxplan123",
            currency: "USD",
            amount: "49.9900",
            isActive: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.plans.updatePrice(
            id: "id",
            priceId: "priceId",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}