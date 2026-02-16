using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetMrrBreakdownTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
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
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/analytics/mrr-breakdown")
                    .WithParam("dateFrom", "2025-01-01")
                    .WithParam("dateTo", "2025-12-31")
                    .UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Analytics.GetMrrBreakdownAsync(
            new GetMrrBreakdownAnalyticsRequest { DateFrom = "2025-01-01", DateTo = "2025-12-31" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
