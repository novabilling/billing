using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetByPlanTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
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
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/charges/plan/planId")
                    .UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Charges.GetByPlanAsync(
            new GetByPlanChargesRequest { PlanId = "planId" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
