import Foundation
import Testing
import Api

@Suite("BillableMetricsClient Wire Tests") struct BillableMetricsClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                [
                  {
                    "id": "clx1234567890",
                    "name": "API Calls",
                    "code": "api_calls",
                    "description": "Number of API calls made",
                    "aggregationType": "COUNT",
                    "fieldName": "tokens",
                    "recurring": false,
                    "filters": [
                      {
                        "id": "clx1234567890",
                        "billableMetricId": "billableMetricId",
                        "key": "region",
                        "values": [
                          "us-east",
                          "us-west",
                          "eu"
                        ]
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
            BillableMetricResponse(
                id: "clx1234567890",
                name: "API Calls",
                code: "api_calls",
                description: Optional("Number of API calls made"),
                aggregationType: .count,
                fieldName: Optional("tokens"),
                recurring: false,
                filters: [
                    BillableMetricFilterResponse(
                        id: "clx1234567890",
                        billableMetricId: "billableMetricId",
                        key: "region",
                        values: [
                            "us-east",
                            "us-west",
                            "eu"
                        ]
                    )
                ],
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            )
        ]
        let response = try await client.billableMetrics.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "name": "API Calls",
                  "code": "api_calls",
                  "description": "Number of API calls made",
                  "aggregationType": "COUNT",
                  "fieldName": "tokens",
                  "recurring": false,
                  "filters": [
                    {
                      "id": "clx1234567890",
                      "billableMetricId": "billableMetricId",
                      "key": "region",
                      "values": [
                        "us-east",
                        "us-west",
                        "eu"
                      ]
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
        let expectedResponse = BillableMetricResponse(
            id: "clx1234567890",
            name: "API Calls",
            code: "api_calls",
            description: Optional("Number of API calls made"),
            aggregationType: .count,
            fieldName: Optional("tokens"),
            recurring: false,
            filters: [
                BillableMetricFilterResponse(
                    id: "clx1234567890",
                    billableMetricId: "billableMetricId",
                    key: "region",
                    values: [
                        "us-east",
                        "us-west",
                        "eu"
                    ]
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.billableMetrics.create(
            request: .init(
                name: "API Calls",
                code: "api_calls",
                aggregationType: .count
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
                  "name": "API Calls",
                  "code": "api_calls",
                  "description": "Number of API calls made",
                  "aggregationType": "COUNT",
                  "fieldName": "tokens",
                  "recurring": false,
                  "filters": [
                    {
                      "id": "clx1234567890",
                      "billableMetricId": "billableMetricId",
                      "key": "region",
                      "values": [
                        "us-east",
                        "us-west",
                        "eu"
                      ]
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
        let expectedResponse = BillableMetricResponse(
            id: "clx1234567890",
            name: "API Calls",
            code: "api_calls",
            description: Optional("Number of API calls made"),
            aggregationType: .count,
            fieldName: Optional("tokens"),
            recurring: false,
            filters: [
                BillableMetricFilterResponse(
                    id: "clx1234567890",
                    billableMetricId: "billableMetricId",
                    key: "region",
                    values: [
                        "us-east",
                        "us-west",
                        "eu"
                    ]
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.billableMetrics.get(
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
                  "name": "API Calls",
                  "code": "api_calls",
                  "description": "Number of API calls made",
                  "aggregationType": "COUNT",
                  "fieldName": "tokens",
                  "recurring": false,
                  "filters": [
                    {
                      "id": "clx1234567890",
                      "billableMetricId": "billableMetricId",
                      "key": "region",
                      "values": [
                        "us-east",
                        "us-west",
                        "eu"
                      ]
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
        let expectedResponse = BillableMetricResponse(
            id: "clx1234567890",
            name: "API Calls",
            code: "api_calls",
            description: Optional("Number of API calls made"),
            aggregationType: .count,
            fieldName: Optional("tokens"),
            recurring: false,
            filters: [
                BillableMetricFilterResponse(
                    id: "clx1234567890",
                    billableMetricId: "billableMetricId",
                    key: "region",
                    values: [
                        "us-east",
                        "us-west",
                        "eu"
                    ]
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.billableMetrics.delete(
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
                  "name": "API Calls",
                  "code": "api_calls",
                  "description": "Number of API calls made",
                  "aggregationType": "COUNT",
                  "fieldName": "tokens",
                  "recurring": false,
                  "filters": [
                    {
                      "id": "clx1234567890",
                      "billableMetricId": "billableMetricId",
                      "key": "region",
                      "values": [
                        "us-east",
                        "us-west",
                        "eu"
                      ]
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
        let expectedResponse = BillableMetricResponse(
            id: "clx1234567890",
            name: "API Calls",
            code: "api_calls",
            description: Optional("Number of API calls made"),
            aggregationType: .count,
            fieldName: Optional("tokens"),
            recurring: false,
            filters: [
                BillableMetricFilterResponse(
                    id: "clx1234567890",
                    billableMetricId: "billableMetricId",
                    key: "region",
                    values: [
                        "us-east",
                        "us-west",
                        "eu"
                    ]
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.billableMetrics.update(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}