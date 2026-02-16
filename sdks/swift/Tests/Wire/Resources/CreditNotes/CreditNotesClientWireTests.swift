import Foundation
import Testing
import Api

@Suite("CreditNotesClient Wire Tests") struct CreditNotesClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "data": [
                    {
                      "id": "clx1234567890",
                      "invoiceId": "clxinv123",
                      "customerId": "clxcust123",
                      "amount": "50.0000",
                      "currency": "USD",
                      "reason": "DUPLICATE",
                      "status": "DRAFT",
                      "metadata": {
                        "key": "value"
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
        let expectedResponse = PaginatedCreditNoteResponse(
            data: [
                CreditNoteResponse(
                    id: "clx1234567890",
                    invoiceId: "clxinv123",
                    customerId: "clxcust123",
                    amount: "50.0000",
                    currency: "USD",
                    reason: .duplicate,
                    status: .draft,
                    metadata: Optional([
                        "key": JSONValue.string("value")
                    ]),
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
        let response = try await client.creditNotes.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "invoiceId": "clxinv123",
                  "customerId": "clxcust123",
                  "amount": "50.0000",
                  "currency": "USD",
                  "reason": "DUPLICATE",
                  "status": "DRAFT",
                  "metadata": {
                    "key": "value"
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
        let expectedResponse = CreditNoteResponse(
            id: "clx1234567890",
            invoiceId: "clxinv123",
            customerId: "clxcust123",
            amount: "50.0000",
            currency: "USD",
            reason: .duplicate,
            status: .draft,
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.creditNotes.create(
            request: .init(
                invoiceId: "invoiceId",
                customerId: "customerId",
                amount: 25000,
                currency: "UGX",
                reason: .duplicate
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
                  "invoiceId": "clxinv123",
                  "customerId": "clxcust123",
                  "amount": "50.0000",
                  "currency": "USD",
                  "reason": "DUPLICATE",
                  "status": "DRAFT",
                  "metadata": {
                    "key": "value"
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
        let expectedResponse = CreditNoteResponse(
            id: "clx1234567890",
            invoiceId: "clxinv123",
            customerId: "clxcust123",
            amount: "50.0000",
            currency: "USD",
            reason: .duplicate,
            status: .draft,
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.creditNotes.get(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func creditNotesControllerUpdate1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "invoiceId": "clxinv123",
                  "customerId": "clxcust123",
                  "amount": "50.0000",
                  "currency": "USD",
                  "reason": "DUPLICATE",
                  "status": "DRAFT",
                  "metadata": {
                    "key": "value"
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
        let expectedResponse = CreditNoteResponse(
            id: "clx1234567890",
            invoiceId: "clxinv123",
            customerId: "clxcust123",
            amount: "50.0000",
            currency: "USD",
            reason: .duplicate,
            status: .draft,
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.creditNotes.creditNotesControllerUpdate(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func finalize1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "invoiceId": "clxinv123",
                  "customerId": "clxcust123",
                  "amount": "50.0000",
                  "currency": "USD",
                  "reason": "DUPLICATE",
                  "status": "DRAFT",
                  "metadata": {
                    "key": "value"
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
        let expectedResponse = CreditNoteResponse(
            id: "clx1234567890",
            invoiceId: "clxinv123",
            customerId: "clxcust123",
            amount: "50.0000",
            currency: "USD",
            reason: .duplicate,
            status: .draft,
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.creditNotes.finalize(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func void1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "invoiceId": "clxinv123",
                  "customerId": "clxcust123",
                  "amount": "50.0000",
                  "currency": "USD",
                  "reason": "DUPLICATE",
                  "status": "DRAFT",
                  "metadata": {
                    "key": "value"
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
        let expectedResponse = CreditNoteResponse(
            id: "clx1234567890",
            invoiceId: "clxinv123",
            customerId: "clxcust123",
            amount: "50.0000",
            currency: "USD",
            reason: .duplicate,
            status: .draft,
            metadata: Optional([
                "key": JSONValue.string("value")
            ]),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.creditNotes.void(
            id: "id",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}