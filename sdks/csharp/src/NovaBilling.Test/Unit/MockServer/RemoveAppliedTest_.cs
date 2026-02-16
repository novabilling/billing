using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class RemoveAppliedTest_ : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            {
              "id": "id",
              "addOnId": "addOnId",
              "customerId": "customerId",
              "subscriptionId": "subscriptionId",
              "amount": "29.9900",
              "currency": "USD",
              "invoiceId": "invoiceId",
              "createdAt": "createdAt"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/add-ons/applied/id")
                    .UsingDelete()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.AddOns.RemoveAppliedAsync(
            new RemoveAppliedAddOnsRequest { Id = "id" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
