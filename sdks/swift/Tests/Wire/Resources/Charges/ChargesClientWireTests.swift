import Foundation
import Testing
import Api

@Suite("ChargesClient Wire Tests") struct ChargesClientWireTests {
    @Test func list1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                [
                  {
                    "id": "clx1234567890",
                    "planId": "clxplan123",
                    "billableMetricId": "clxbm123",
                    "chargeModel": "STANDARD",
                    "billingTiming": "IN_ADVANCE",
                    "invoiceDisplayName": "API Usage",
                    "minAmountCents": 100,
                    "prorated": false,
                    "properties": {
                      "key": "value"
                    },
                    "graduatedRanges": [
                      {
                        "id": "clx1234567890",
                        "chargeId": "chargeId",
                        "fromValue": 0,
                        "toValue": 1000,
                        "perUnitAmount": "0.0100",
                        "flatAmount": "0.0000",
                        "order": 0
                      }
                    ],
                    "filters": [
                      {
                        "id": "clx1234567890",
                        "chargeId": "chargeId",
                        "key": "region",
                        "values": [
                          "us-east"
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
            ChargeResponse(
                id: "clx1234567890",
                planId: "clxplan123",
                billableMetricId: "clxbm123",
                chargeModel: .standard,
                billingTiming: .inAdvance,
                invoiceDisplayName: Optional("API Usage"),
                minAmountCents: Optional(100),
                prorated: false,
                properties: Optional([
                    "key": JSONValue.string("value")
                ]),
                graduatedRanges: [
                    ChargeGraduatedRangeResponse(
                        id: "clx1234567890",
                        chargeId: "chargeId",
                        fromValue: 0,
                        toValue: Optional(1000),
                        perUnitAmount: "0.0100",
                        flatAmount: "0.0000",
                        order: 0
                    )
                ],
                filters: [
                    ChargeFilterResponse(
                        id: "clx1234567890",
                        chargeId: "chargeId",
                        key: "region",
                        values: [
                            "us-east"
                        ]
                    )
                ],
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            )
        ]
        let response = try await client.charges.list(requestOptions: RequestOptions(additionalHeaders: stub.headers))
        try #require(response == expectedResponse)
    }

    @Test func create1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                {
                  "id": "clx1234567890",
                  "planId": "clxplan123",
                  "billableMetricId": "clxbm123",
                  "chargeModel": "STANDARD",
                  "billingTiming": "IN_ADVANCE",
                  "invoiceDisplayName": "API Usage",
                  "minAmountCents": 100,
                  "prorated": false,
                  "properties": {
                    "key": "value"
                  },
                  "graduatedRanges": [
                    {
                      "id": "clx1234567890",
                      "chargeId": "chargeId",
                      "fromValue": 0,
                      "toValue": 1000,
                      "perUnitAmount": "0.0100",
                      "flatAmount": "0.0000",
                      "order": 0
                    }
                  ],
                  "filters": [
                    {
                      "id": "clx1234567890",
                      "chargeId": "chargeId",
                      "key": "region",
                      "values": [
                        "us-east"
                      ],
                      "properties": {
                        "key": "value"
                      }
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
        let expectedResponse = ChargeResponse(
            id: "clx1234567890",
            planId: "clxplan123",
            billableMetricId: "clxbm123",
            chargeModel: .standard,
            billingTiming: .inAdvance,
            invoiceDisplayName: Optional("API Usage"),
            minAmountCents: Optional(100),
            prorated: false,
            properties: Optional([
                "key": JSONValue.string("value")
            ]),
            graduatedRanges: [
                ChargeGraduatedRangeResponse(
                    id: "clx1234567890",
                    chargeId: "chargeId",
                    fromValue: 0,
                    toValue: Optional(1000),
                    perUnitAmount: "0.0100",
                    flatAmount: "0.0000",
                    order: 0
                )
            ],
            filters: [
                ChargeFilterResponse(
                    id: "clx1234567890",
                    chargeId: "chargeId",
                    key: "region",
                    values: [
                        "us-east"
                    ],
                    properties: Optional([
                        "key": JSONValue.string("value")
                    ])
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.charges.create(
            request: .init(
                planId: "planId",
                billableMetricId: "billableMetricId",
                chargeModel: .standard
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
                  "planId": "clxplan123",
                  "billableMetricId": "clxbm123",
                  "chargeModel": "STANDARD",
                  "billingTiming": "IN_ADVANCE",
                  "invoiceDisplayName": "API Usage",
                  "minAmountCents": 100,
                  "prorated": false,
                  "properties": {
                    "key": "value"
                  },
                  "graduatedRanges": [
                    {
                      "id": "clx1234567890",
                      "chargeId": "chargeId",
                      "fromValue": 0,
                      "toValue": 1000,
                      "perUnitAmount": "0.0100",
                      "flatAmount": "0.0000",
                      "order": 0
                    }
                  ],
                  "filters": [
                    {
                      "id": "clx1234567890",
                      "chargeId": "chargeId",
                      "key": "region",
                      "values": [
                        "us-east"
                      ],
                      "properties": {
                        "key": "value"
                      }
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
        let expectedResponse = ChargeResponse(
            id: "clx1234567890",
            planId: "clxplan123",
            billableMetricId: "clxbm123",
            chargeModel: .standard,
            billingTiming: .inAdvance,
            invoiceDisplayName: Optional("API Usage"),
            minAmountCents: Optional(100),
            prorated: false,
            properties: Optional([
                "key": JSONValue.string("value")
            ]),
            graduatedRanges: [
                ChargeGraduatedRangeResponse(
                    id: "clx1234567890",
                    chargeId: "chargeId",
                    fromValue: 0,
                    toValue: Optional(1000),
                    perUnitAmount: "0.0100",
                    flatAmount: "0.0000",
                    order: 0
                )
            ],
            filters: [
                ChargeFilterResponse(
                    id: "clx1234567890",
                    chargeId: "chargeId",
                    key: "region",
                    values: [
                        "us-east"
                    ],
                    properties: Optional([
                        "key": JSONValue.string("value")
                    ])
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.charges.get(
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
                  "planId": "clxplan123",
                  "billableMetricId": "clxbm123",
                  "chargeModel": "STANDARD",
                  "billingTiming": "IN_ADVANCE",
                  "invoiceDisplayName": "API Usage",
                  "minAmountCents": 100,
                  "prorated": false,
                  "properties": {
                    "key": "value"
                  },
                  "graduatedRanges": [
                    {
                      "id": "clx1234567890",
                      "chargeId": "chargeId",
                      "fromValue": 0,
                      "toValue": 1000,
                      "perUnitAmount": "0.0100",
                      "flatAmount": "0.0000",
                      "order": 0
                    }
                  ],
                  "filters": [
                    {
                      "id": "clx1234567890",
                      "chargeId": "chargeId",
                      "key": "region",
                      "values": [
                        "us-east"
                      ],
                      "properties": {
                        "key": "value"
                      }
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
        let expectedResponse = ChargeResponse(
            id: "clx1234567890",
            planId: "clxplan123",
            billableMetricId: "clxbm123",
            chargeModel: .standard,
            billingTiming: .inAdvance,
            invoiceDisplayName: Optional("API Usage"),
            minAmountCents: Optional(100),
            prorated: false,
            properties: Optional([
                "key": JSONValue.string("value")
            ]),
            graduatedRanges: [
                ChargeGraduatedRangeResponse(
                    id: "clx1234567890",
                    chargeId: "chargeId",
                    fromValue: 0,
                    toValue: Optional(1000),
                    perUnitAmount: "0.0100",
                    flatAmount: "0.0000",
                    order: 0
                )
            ],
            filters: [
                ChargeFilterResponse(
                    id: "clx1234567890",
                    chargeId: "chargeId",
                    key: "region",
                    values: [
                        "us-east"
                    ],
                    properties: Optional([
                        "key": JSONValue.string("value")
                    ])
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.charges.delete(
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
                  "planId": "clxplan123",
                  "billableMetricId": "clxbm123",
                  "chargeModel": "STANDARD",
                  "billingTiming": "IN_ADVANCE",
                  "invoiceDisplayName": "API Usage",
                  "minAmountCents": 100,
                  "prorated": false,
                  "properties": {
                    "key": "value"
                  },
                  "graduatedRanges": [
                    {
                      "id": "clx1234567890",
                      "chargeId": "chargeId",
                      "fromValue": 0,
                      "toValue": 1000,
                      "perUnitAmount": "0.0100",
                      "flatAmount": "0.0000",
                      "order": 0
                    }
                  ],
                  "filters": [
                    {
                      "id": "clx1234567890",
                      "chargeId": "chargeId",
                      "key": "region",
                      "values": [
                        "us-east"
                      ],
                      "properties": {
                        "key": "value"
                      }
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
        let expectedResponse = ChargeResponse(
            id: "clx1234567890",
            planId: "clxplan123",
            billableMetricId: "clxbm123",
            chargeModel: .standard,
            billingTiming: .inAdvance,
            invoiceDisplayName: Optional("API Usage"),
            minAmountCents: Optional(100),
            prorated: false,
            properties: Optional([
                "key": JSONValue.string("value")
            ]),
            graduatedRanges: [
                ChargeGraduatedRangeResponse(
                    id: "clx1234567890",
                    chargeId: "chargeId",
                    fromValue: 0,
                    toValue: Optional(1000),
                    perUnitAmount: "0.0100",
                    flatAmount: "0.0000",
                    order: 0
                )
            ],
            filters: [
                ChargeFilterResponse(
                    id: "clx1234567890",
                    chargeId: "chargeId",
                    key: "region",
                    values: [
                        "us-east"
                    ],
                    properties: Optional([
                        "key": JSONValue.string("value")
                    ])
                )
            ],
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        )
        let response = try await client.charges.update(
            id: "id",
            request: .init(),
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }

    @Test func getByPlan1() async throws -> Void {
        let stub = HTTPStub()
        stub.setResponse(
            body: Data(
                """
                [
                  {
                    "id": "clx1234567890",
                    "planId": "clxplan123",
                    "billableMetricId": "clxbm123",
                    "chargeModel": "STANDARD",
                    "billingTiming": "IN_ADVANCE",
                    "invoiceDisplayName": "API Usage",
                    "minAmountCents": 100,
                    "prorated": false,
                    "properties": {
                      "key": "value"
                    },
                    "graduatedRanges": [
                      {
                        "id": "clx1234567890",
                        "chargeId": "chargeId",
                        "fromValue": 0,
                        "toValue": 1000,
                        "perUnitAmount": "0.0100",
                        "flatAmount": "0.0000",
                        "order": 0
                      }
                    ],
                    "filters": [
                      {
                        "id": "clx1234567890",
                        "chargeId": "chargeId",
                        "key": "region",
                        "values": [
                          "us-east"
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
            ChargeResponse(
                id: "clx1234567890",
                planId: "clxplan123",
                billableMetricId: "clxbm123",
                chargeModel: .standard,
                billingTiming: .inAdvance,
                invoiceDisplayName: Optional("API Usage"),
                minAmountCents: Optional(100),
                prorated: false,
                properties: Optional([
                    "key": JSONValue.string("value")
                ]),
                graduatedRanges: [
                    ChargeGraduatedRangeResponse(
                        id: "clx1234567890",
                        chargeId: "chargeId",
                        fromValue: 0,
                        toValue: Optional(1000),
                        perUnitAmount: "0.0100",
                        flatAmount: "0.0000",
                        order: 0
                    )
                ],
                filters: [
                    ChargeFilterResponse(
                        id: "clx1234567890",
                        chargeId: "chargeId",
                        key: "region",
                        values: [
                            "us-east"
                        ]
                    )
                ],
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            )
        ]
        let response = try await client.charges.getByPlan(
            planId: "planId",
            requestOptions: RequestOptions(additionalHeaders: stub.headers)
        )
        try #require(response == expectedResponse)
    }
}