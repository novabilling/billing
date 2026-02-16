import Foundation
import Testing
import Api

@Suite("AddOnsClient Wire Tests") struct AddOnsClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "data": [
                    {
                      "id": "clx1234567890",
                      "name": "Extra Storage",
                      "code": "extra_storage",
                      "description": "50GB additional storage",
                      "invoiceDisplayName": "Storage Add-On",
                      "prices": [
                        {
                          "id": "clx1234567890",
                          "addOnId": "addOnId",
                          "currency": "USD",
                          "amount": "29.9900"
                        }
                      ],
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
        let expectedResponse = PaginatedAddOnResponse(
            data: [
                AddOnResponse(
                    id: "clx1234567890",
                    name: "Extra Storage",
                    code: "extra_storage",
                    description: Optional("50GB additional storage"),
                    invoiceDisplayName: Optional("Storage Add-On"),
                    prices: [
                        AddOnPriceResponse(
                            id: "clx1234567890",
                            addOnId: "addOnId",
                            currency: "USD",
                            amount: "29.9900"
                        )
                    ],
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
        let response = try await client.addOns.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "name": "Extra Storage",
                  "code": "extra_storage",
                  "description": "50GB additional storage",
                  "invoiceDisplayName": "Storage Add-On",
                  "prices": [
                    {
                      "id": "clx1234567890",
                      "addOnId": "addOnId",
                      "currency": "USD",
                      "amount": "29.9900"
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
        let expectedResponse = AddOnResponse(
            id: "clx1234567890",
            name: "Extra Storage",
            code: "extra_storage",
            description: Optional("50GB additional storage"),
            invoiceDisplayName: Optional("Storage Add-On"),
            prices: [
                AddOnPriceResponse(
                    id: "clx1234567890",
                    addOnId: "addOnId",
                    currency: "USD",
                    amount: "29.9900"
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.addOns.create(
            request: .init(
                name: "Premium Support",
                code: "premium_support",
                prices: [
                    AddOnPriceDto(
                        currency: "UGX",
                        amount: 50000
                    )
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
                  "name": "Extra Storage",
                  "code": "extra_storage",
                  "description": "50GB additional storage",
                  "invoiceDisplayName": "Storage Add-On",
                  "prices": [
                    {
                      "id": "clx1234567890",
                      "addOnId": "addOnId",
                      "currency": "USD",
                      "amount": "29.9900"
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
        let expectedResponse = AddOnResponse(
            id: "clx1234567890",
            name: "Extra Storage",
            code: "extra_storage",
            description: Optional("50GB additional storage"),
            invoiceDisplayName: Optional("Storage Add-On"),
            prices: [
                AddOnPriceResponse(
                    id: "clx1234567890",
                    addOnId: "addOnId",
                    currency: "USD",
                    amount: "29.9900"
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.addOns.get(
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
                  "name": "Extra Storage",
                  "code": "extra_storage",
                  "description": "50GB additional storage",
                  "invoiceDisplayName": "Storage Add-On",
                  "prices": [
                    {
                      "id": "clx1234567890",
                      "addOnId": "addOnId",
                      "currency": "USD",
                      "amount": "29.9900"
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
        let expectedResponse = AddOnResponse(
            id: "clx1234567890",
            name: "Extra Storage",
            code: "extra_storage",
            description: Optional("50GB additional storage"),
            invoiceDisplayName: Optional("Storage Add-On"),
            prices: [
                AddOnPriceResponse(
                    id: "clx1234567890",
                    addOnId: "addOnId",
                    currency: "USD",
                    amount: "29.9900"
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.addOns.delete(
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
                  "name": "Extra Storage",
                  "code": "extra_storage",
                  "description": "50GB additional storage",
                  "invoiceDisplayName": "Storage Add-On",
                  "prices": [
                    {
                      "id": "clx1234567890",
                      "addOnId": "addOnId",
                      "currency": "USD",
                      "amount": "29.9900"
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
        let expectedResponse = AddOnResponse(
            id: "clx1234567890",
            name: "Extra Storage",
            code: "extra_storage",
            description: Optional("50GB additional storage"),
            invoiceDisplayName: Optional("Storage Add-On"),
            prices: [
                AddOnPriceResponse(
                    id: "clx1234567890",
                    addOnId: "addOnId",
                    currency: "USD",
                    amount: "29.9900"
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.addOns.update(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func apply1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "id",
                  "addOnId": "addOnId",
                  "customerId": "customerId",
                  "subscriptionId": "subscriptionId",
                  "amount": "29.9900",
                  "currency": "USD",
                  "invoiceId": "invoiceId",
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
        let expectedResponse = AppliedAddOnResponse(
            id: "id",
            addOnId: "addOnId",
            customerId: "customerId",
            subscriptionId: Optional("subscriptionId"),
            amount: "29.9900",
            currency: "USD",
            invoiceId: Optional("invoiceId"),
            createdAt: "createdAt"
        )
        let response = try await client.addOns.apply(
            request: .init(
                addOnId: "addOnId",
                customerId: "customerId",
                amount: 50000,
                currency: "UGX"
            ),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func listApplied1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                [
                  {
                    "id": "id",
                    "addOnId": "addOnId",
                    "customerId": "customerId",
                    "subscriptionId": "subscriptionId",
                    "amount": "29.9900",
                    "currency": "USD",
                    "invoiceId": "invoiceId",
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
            AppliedAddOnResponse(
                id: "id",
                addOnId: "addOnId",
                customerId: "customerId",
                subscriptionId: Optional("subscriptionId"),
                amount: "29.9900",
                currency: "USD",
                invoiceId: Optional("invoiceId"),
                createdAt: "createdAt"
            )
        ]
        let response = try await client.addOns.listApplied(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func removeApplied1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "id",
                  "addOnId": "addOnId",
                  "customerId": "customerId",
                  "subscriptionId": "subscriptionId",
                  "amount": "29.9900",
                  "currency": "USD",
                  "invoiceId": "invoiceId",
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
        let expectedResponse = AppliedAddOnResponse(
            id: "id",
            addOnId: "addOnId",
            customerId: "customerId",
            subscriptionId: Optional("subscriptionId"),
            amount: "29.9900",
            currency: "USD",
            invoiceId: Optional("invoiceId"),
            createdAt: "createdAt"
        )
        let response = try await client.addOns.removeApplied(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}