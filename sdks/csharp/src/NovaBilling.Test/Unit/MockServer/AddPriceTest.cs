using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class AddPriceTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "currency": "NGN",
              "amount": 9999.99
            }
            """;

        const string mockResponse = """
            {
              "id": "clx1234567890",
              "planId": "clxplan123",
              "currency": "USD",
              "amount": "49.9900",
              "isActive": true,
              "createdAt": "createdAt",
              "updatedAt": "updatedAt"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/plans/id/prices")
                    .WithHeader("Content-Type", "application/json")
                    .UsingPost()
                    .WithBodyAsJson(requestJson)
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Plans.AddPriceAsync(
            new AddPricePlansRequest
            {
                Id = "id",
                Body = new CreatePlanPriceDto { Currency = "NGN", Amount = 9999.99 },
            }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
