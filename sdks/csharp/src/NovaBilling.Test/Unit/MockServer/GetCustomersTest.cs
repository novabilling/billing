using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetCustomersTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            {
              "totalCustomers": 150,
              "newCustomers": 12,
              "arpu": "83.33",
              "totalRevenue": "12500.0000"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/analytics/customers")
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

        var response = await Client.Analytics.GetCustomersAsync(
            new GetCustomersAnalyticsRequest { DateFrom = "2025-01-01", DateTo = "2025-12-31" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
