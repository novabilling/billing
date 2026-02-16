using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class UpdatePriceTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
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
                    .WithPath("/api/plans/id/prices/priceId")
                    .UsingPatch()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Plans.UpdatePriceAsync(
            new UpdatePricePlansRequest { Id = "id", PriceId = "priceId" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
