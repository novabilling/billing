import Foundation
import Testing
import Api

@Suite("AnalyticsClient Wire Tests") struct AnalyticsClientWireTests {
    @Test func getRevenue1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "totalRevenue": "12500.0000",
                  "invoiceCount": 45,
                  "mrr": "4200.0000",
                  "arr": "50400.0000"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = RevenueAnalyticsResponse(
            totalRevenue: "12500.0000",
            invoiceCount: 45,
            mrr: "4200.0000",
            arr: "50400.0000"
        )
        let response = try await client.analytics.getRevenue(
            dateFrom: "2025-01-01",
            dateTo: "2025-12-31",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getSubscriptions1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "total": 100,
                  "active": 85,
                  "canceled": 5,
                  "trialing": 8,
                  "paused": 2,
                  "newSubscriptions": 12,
                  "churnRate": "5.00",
                  "retentionRate": "95.00"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = SubscriptionAnalyticsResponse(
            total: 100,
            active: 85,
            canceled: 5,
            trialing: 8,
            paused: 2,
            newSubscriptions: 12,
            churnRate: "5.00",
            retentionRate: "95.00"
        )
        let response = try await client.analytics.getSubscriptions(
            dateFrom: "2025-01-01",
            dateTo: "2025-12-31",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getCustomers1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "totalCustomers": 150,
                  "newCustomers": 12,
                  "arpu": "83.33",
                  "totalRevenue": "12500.0000"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = CustomerAnalyticsResponse(
            totalCustomers: 150,
            newCustomers: 12,
            arpu: "83.33",
            totalRevenue: "12500.0000"
        )
        let response = try await client.analytics.getCustomers(
            dateFrom: "2025-01-01",
            dateTo: "2025-12-31",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getPayments1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "totalPayments": 200,
                  "succeeded": 180,
                  "failed": 15,
                  "pending": 5,
                  "successRate": "90.00"
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = PaymentAnalyticsResponse(
            totalPayments: 200,
            succeeded: 180,
            failed: 15,
            pending: 5,
            successRate: "90.00"
        )
        let response = try await client.analytics.getPayments(
            dateFrom: "2025-01-01",
            dateTo: "2025-12-31",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getMrrBreakdown1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "totalMrr": 1.1,
                  "newMrr": 1.1,
                  "expansionMrr": 1.1,
                  "contractionMrr": 1.1,
                  "churnMrr": 1.1,
                  "netNewMrr": 1.1,
                  "byPlan": [
                    {
                      "planId": "planId",
                      "planName": "planName",
                      "mrr": 1.1,
                      "subscriptionCount": 1.1
                    }
                  ]
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = MrrBreakdownResponse(
            totalMrr: 1.1,
            newMrr: 1.1,
            expansionMrr: 1.1,
            contractionMrr: 1.1,
            churnMrr: 1.1,
            netNewMrr: 1.1,
            byPlan: [
                MrrPlanBreakdown(
                    planId: "planId",
                    planName: "planName",
                    mrr: 1.1,
                    subscriptionCount: 1.1
                )
            ]
        )
        let response = try await client.analytics.getMrrBreakdown(
            dateFrom: "2025-01-01",
            dateTo: "2025-12-31",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getNetRevenue1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "grossRevenue": 1.1,
                  "refunds": 1.1,
                  "creditNotes": 1.1,
                  "netRevenue": 1.1
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = NetRevenueResponse(
            grossRevenue: 1.1,
            refunds: 1.1,
            creditNotes: 1.1,
            netRevenue: 1.1
        )
        let response = try await client.analytics.getNetRevenue(
            dateFrom: "2025-01-01",
            dateTo: "2025-12-31",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getChurnCohorts1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "months": [
                    "months"
                  ],
                  "cohorts": [
                    {
                      "month": "2026-01",
                      "totalCustomers": 1.1,
                      "retentionPercentages": [
                        1.1
                      ]
                    }
                  ]
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = ChurnCohortsResponse(
            months: [
                "months"
            ],
            cohorts: [
                CohortRow(
                    month: "2026-01",
                    totalCustomers: 1.1,
                    retentionPercentages: [
                        1.1
                    ]
                )
            ]
        )
        let response = try await client.analytics.getChurnCohorts(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func getLifetimeValue1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "avgLtv": 1.1,
                  "avgLifespanDays": 1.1,
                  "byPlan": [
                    {
                      "planId": "planId",
                      "planName": "planName",
                      "avgLtv": 1.1,
                      "avgLifespanDays": 1.1
                    }
                  ]
                }
                """.utf8
            )
        )
        let client = NovaBillingClient(
            baseURL: "https://api.fern.com",
            token: "<token>",
            urlSession: stub.urlSession
        )
        let expectedResponse = LtvResponse(
            avgLtv: 1.1,
            avgLifespanDays: 1.1,
            byPlan: [
                LtvPlanBreakdown(
                    planId: "planId",
                    planName: "planName",
                    avgLtv: 1.1,
                    avgLifespanDays: 1.1
                )
            ]
        )
        let response = try await client.analytics.getLifetimeValue(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }
}