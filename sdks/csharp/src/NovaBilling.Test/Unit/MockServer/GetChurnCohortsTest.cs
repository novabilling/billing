using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetChurnCohortsTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
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
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/analytics/churn-cohorts")
                    .UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Analytics.GetChurnCohortsAsync(
            new GetChurnCohortsAnalyticsRequest()
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
