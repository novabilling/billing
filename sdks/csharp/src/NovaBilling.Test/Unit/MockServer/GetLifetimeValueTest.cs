using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetLifetimeValueTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
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
            """;

        Server
            .Given(
                WireMock.RequestBuilders.Request.Create().WithPath("/api/analytics/ltv").UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Analytics.GetLifetimeValueAsync();
        JsonAssert.AreEqual(response, mockResponse);
    }
}
