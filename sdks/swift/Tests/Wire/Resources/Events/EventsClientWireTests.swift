import Foundation
import Testing
import Api

@Suite("EventsClient Wire Tests") struct EventsClientWireTests {
    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "transactionId": "txn_unique_123",
                  "subscriptionId": "clxsub123",
                  "code": "api_calls",
                  "timestamp": "timestamp",
                  "properties": {
                    "region": "us-east",
                    "bytes": 1024
                  },
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
        let expectedResponse = UsageEventResponse(
            id: "clx1234567890",
            transactionId: "txn_unique_123",
            subscriptionId: "clxsub123",
            code: "api_calls",
            timestamp: "timestamp",
            properties: Optional([
                "region": JSONValue.string("us-east"), 
                "bytes": JSONValue.number(1024)
            ]),
            createdAt: "createdAt"
        )
        let response = try await client.events.create(
            request: CreateEventDto(
                transactionId: "evt_12345",
                subscriptionId: "sub_abc123",
                code: "api_calls"
            ),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func createBatch1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "received": 5,
                  "processed": 5,
                  "duplicates": 0
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = BatchEventResponse(
            received: 5,
            processed: 5,
            duplicates: 0
        )
        let response = try await client.events.createBatch(
            request: .init(events: [
                CreateEventDto(
                    transactionId: "evt_12345",
                    subscriptionId: "sub_abc123",
                    code: "api_calls"
                )
            ]),
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
                  "transactionId": "txn_unique_123",
                  "subscriptionId": "clxsub123",
                  "code": "api_calls",
                  "timestamp": "timestamp",
                  "properties": {
                    "region": "us-east",
                    "bytes": 1024
                  },
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
        let expectedResponse = UsageEventResponse(
            id: "clx1234567890",
            transactionId: "txn_unique_123",
            subscriptionId: "clxsub123",
            code: "api_calls",
            timestamp: "timestamp",
            properties: Optional([
                "region": JSONValue.string("us-east"), 
                "bytes": JSONValue.number(1024)
            ]),
            createdAt: "createdAt"
        )
        let response = try await client.events.get(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getBySubscription1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "data": [
                    {
                      "id": "clx1234567890",
                      "transactionId": "txn_unique_123",
                      "subscriptionId": "clxsub123",
                      "code": "api_calls",
                      "timestamp": "timestamp",
                      "properties": {
                        "region": "us-east",
                        "bytes": 1024
                      },
                      "createdAt": "createdAt"
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
        let expectedResponse = PaginatedUsageEventResponse(
            data: [
                UsageEventResponse(
                    id: "clx1234567890",
                    transactionId: "txn_unique_123",
                    subscriptionId: "clxsub123",
                    code: "api_calls",
                    timestamp: "timestamp",
                    properties: Optional([
                        "region": JSONValue.string("us-east"), 
                        "bytes": JSONValue.number(1024)
                    ]),
                    createdAt: "createdAt"
                )
            ],
            meta: PaginationMeta(
                total: 150,
                page: 1,
                limit: 20,
                totalPages: 8
            )
        )
        let response = try await client.events.getBySubscription(
            subscriptionId: "subscriptionId",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}