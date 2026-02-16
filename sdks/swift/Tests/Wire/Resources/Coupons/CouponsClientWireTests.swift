import Foundation
import Testing
import Api

@Suite("CouponsClient Wire Tests") struct CouponsClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "data": [
                    {
                      "id": "clx1234567890",
                      "code": "SUMMER2026",
                      "name": "Summer Sale",
                      "description": "20% off all plans",
                      "discountType": "PERCENTAGE",
                      "discountValue": "20.0000",
                      "currency": "USD",
                      "maxRedemptions": 100,
                      "redemptionCount": 5,
                      "appliesToPlanIds": [
                        "clxplan123"
                      ],
                      "isActive": true,
                      "expiresAt": "expiresAt",
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
        let expectedResponse = PaginatedCouponResponse(
            data: [
                CouponResponse(
                    id: "clx1234567890",
                    code: "SUMMER2026",
                    name: "Summer Sale",
                    description: Optional("20% off all plans"),
                    discountType: .percentage,
                    discountValue: "20.0000",
                    currency: Optional("USD"),
                    maxRedemptions: Optional(100),
                    redemptionCount: 5,
                    appliesToPlanIds: [
                        "clxplan123"
                    ],
                    isActive: true,
                    expiresAt: Optional("expiresAt"),
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
        let response = try await client.coupons.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "code": "SUMMER2026",
                  "name": "Summer Sale",
                  "description": "20% off all plans",
                  "discountType": "PERCENTAGE",
                  "discountValue": "20.0000",
                  "currency": "USD",
                  "maxRedemptions": 100,
                  "redemptionCount": 5,
                  "appliesToPlanIds": [
                    "clxplan123"
                  ],
                  "isActive": true,
                  "expiresAt": "expiresAt",
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
        let expectedResponse = CouponResponse(
            id: "clx1234567890",
            code: "SUMMER2026",
            name: "Summer Sale",
            description: Optional("20% off all plans"),
            discountType: .percentage,
            discountValue: "20.0000",
            currency: Optional("USD"),
            maxRedemptions: Optional(100),
            redemptionCount: 5,
            appliesToPlanIds: [
                "clxplan123"
            ],
            isActive: true,
            expiresAt: Optional("expiresAt"),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.coupons.create(
            request: .init(
                code: "WELCOME20",
                name: "20% Welcome Discount",
                discountType: .percentage,
                discountValue: 20
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
                  "code": "SUMMER2026",
                  "name": "Summer Sale",
                  "description": "20% off all plans",
                  "discountType": "PERCENTAGE",
                  "discountValue": "20.0000",
                  "currency": "USD",
                  "maxRedemptions": 100,
                  "redemptionCount": 5,
                  "appliesToPlanIds": [
                    "clxplan123"
                  ],
                  "isActive": true,
                  "expiresAt": "expiresAt",
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
        let expectedResponse = CouponResponse(
            id: "clx1234567890",
            code: "SUMMER2026",
            name: "Summer Sale",
            description: Optional("20% off all plans"),
            discountType: .percentage,
            discountValue: "20.0000",
            currency: Optional("USD"),
            maxRedemptions: Optional(100),
            redemptionCount: 5,
            appliesToPlanIds: [
                "clxplan123"
            ],
            isActive: true,
            expiresAt: Optional("expiresAt"),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.coupons.get(
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
                  "code": "SUMMER2026",
                  "name": "Summer Sale",
                  "description": "20% off all plans",
                  "discountType": "PERCENTAGE",
                  "discountValue": "20.0000",
                  "currency": "USD",
                  "maxRedemptions": 100,
                  "redemptionCount": 5,
                  "appliesToPlanIds": [
                    "clxplan123"
                  ],
                  "isActive": true,
                  "expiresAt": "expiresAt",
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
        let expectedResponse = CouponResponse(
            id: "clx1234567890",
            code: "SUMMER2026",
            name: "Summer Sale",
            description: Optional("20% off all plans"),
            discountType: .percentage,
            discountValue: "20.0000",
            currency: Optional("USD"),
            maxRedemptions: Optional(100),
            redemptionCount: 5,
            appliesToPlanIds: [
                "clxplan123"
            ],
            isActive: true,
            expiresAt: Optional("expiresAt"),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.coupons.delete(
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
                  "code": "SUMMER2026",
                  "name": "Summer Sale",
                  "description": "20% off all plans",
                  "discountType": "PERCENTAGE",
                  "discountValue": "20.0000",
                  "currency": "USD",
                  "maxRedemptions": 100,
                  "redemptionCount": 5,
                  "appliesToPlanIds": [
                    "clxplan123"
                  ],
                  "isActive": true,
                  "expiresAt": "expiresAt",
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
        let expectedResponse = CouponResponse(
            id: "clx1234567890",
            code: "SUMMER2026",
            name: "Summer Sale",
            description: Optional("20% off all plans"),
            discountType: .percentage,
            discountValue: "20.0000",
            currency: Optional("USD"),
            maxRedemptions: Optional(100),
            redemptionCount: 5,
            appliesToPlanIds: [
                "clxplan123"
            ],
            isActive: true,
            expiresAt: Optional("expiresAt"),
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.coupons.update(
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
                  "couponId": "couponId",
                  "customerId": "customerId",
                  "subscriptionId": "subscriptionId",
                  "amountOff": "20.0000",
                  "usesRemaining": 3,
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
        let expectedResponse = AppliedCouponResponse(
            id: "id",
            couponId: "couponId",
            customerId: "customerId",
            subscriptionId: Optional("subscriptionId"),
            amountOff: Optional("20.0000"),
            usesRemaining: Optional(3),
            createdAt: "createdAt"
        )
        let response = try await client.coupons.apply(
            request: .init(
                couponId: "couponId",
                customerId: "customerId"
            ),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}