using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetRevenueTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            {
              "totalRevenue": "12500.0000",
              "invoiceCount": 45,
              "mrr": "4200.0000",
              "arr": "50400.0000"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/analytics/revenue")
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

        var response = await Client.Analytics.GetRevenueAsync(
            new GetRevenueAnalyticsRequest { DateFrom = "2025-01-01", DateTo = "2025-12-31" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
