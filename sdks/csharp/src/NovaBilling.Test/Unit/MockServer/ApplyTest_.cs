using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class ApplyTest_ : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "addOnId": "addOnId",
              "customerId": "customerId",
              "amount": 50000,
              "currency": "UGX"
            }
            """;

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
                    .WithPath("/api/add-ons/apply")
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

        var response = await Client.AddOns.ApplyAsync(
            new ApplyAddOnDto
            {
                AddOnId = "addOnId",
                CustomerId = "customerId",
                Amount = 50000,
                Currency = "UGX",
            }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
