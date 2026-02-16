using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetNetRevenueTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            {
              "grossRevenue": 1.1,
              "refunds": 1.1,
              "creditNotes": 1.1,
              "netRevenue": 1.1
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/analytics/net-revenue")
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

        var response = await Client.Analytics.GetNetRevenueAsync(
            new GetNetRevenueAnalyticsRequest { DateFrom = "2025-01-01", DateTo = "2025-12-31" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
