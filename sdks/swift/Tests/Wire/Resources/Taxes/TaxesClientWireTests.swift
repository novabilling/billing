import Foundation
import Testing
import Api

@Suite("TaxesClient Wire Tests") struct TaxesClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "data": [
                    {
                      "id": "clx1234567890",
                      "name": "VAT",
                      "code": "vat_18",
                      "rate": "18.0000",
                      "description": "Value Added Tax",
                      "appliedByDefault": true,
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
        let expectedResponse = PaginatedTaxResponse(
            data: [
                TaxResponse(
                    id: "clx1234567890",
                    name: "VAT",
                    code: "vat_18",
                    rate: "18.0000",
                    description: Optional("Value Added Tax"),
                    appliedByDefault: true,
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
        let response = try await client.taxes.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "name": "VAT",
                  "code": "vat_18",
                  "rate": "18.0000",
                  "description": "Value Added Tax",
                  "appliedByDefault": true,
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
        let expectedResponse = TaxResponse(
            id: "clx1234567890",
            name: "VAT",
            code: "vat_18",
            rate: "18.0000",
            description: Optional("Value Added Tax"),
            appliedByDefault: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.taxes.create(
            request: .init(
                name: "VAT",
                code: "vat_18",
                rate: 18
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
                  "name": "VAT",
                  "code": "vat_18",
                  "rate": "18.0000",
                  "description": "Value Added Tax",
                  "appliedByDefault": true,
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
        let expectedResponse = TaxResponse(
            id: "clx1234567890",
            name: "VAT",
            code: "vat_18",
            rate: "18.0000",
            description: Optional("Value Added Tax"),
            appliedByDefault: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.taxes.get(
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
                  "name": "VAT",
                  "code": "vat_18",
                  "rate": "18.0000",
                  "description": "Value Added Tax",
                  "appliedByDefault": true,
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
        let expectedResponse = TaxResponse(
            id: "clx1234567890",
            name: "VAT",
            code: "vat_18",
            rate: "18.0000",
            description: Optional("Value Added Tax"),
            appliedByDefault: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.taxes.update(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func taxesControllerGetCustomerTaxes1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                [
                  {
                    "id": "clx1234567890",
                    "name": "VAT",
                    "code": "vat_18",
                    "rate": "18.0000",
                    "description": "Value Added Tax",
                    "appliedByDefault": true,
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
            TaxResponse(
                id: "clx1234567890",
                name: "VAT",
                code: "vat_18",
                rate: "18.0000",
                description: Optional("Value Added Tax"),
                appliedByDefault: true,
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            )
        ]
        let response = try await client.taxes.taxesControllerGetCustomerTaxes(
            customerId: "customerId",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func taxesControllerGetPlanTaxes1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                [
                  {
                    "id": "clx1234567890",
                    "name": "VAT",
                    "code": "vat_18",
                    "rate": "18.0000",
                    "description": "Value Added Tax",
                    "appliedByDefault": true,
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
            TaxResponse(
                id: "clx1234567890",
                name: "VAT",
                code: "vat_18",
                rate: "18.0000",
                description: Optional("Value Added Tax"),
                appliedByDefault: true,
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            )
        ]
        let response = try await client.taxes.taxesControllerGetPlanTaxes(
            planId: "planId",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}