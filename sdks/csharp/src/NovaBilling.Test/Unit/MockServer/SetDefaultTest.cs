using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class SetDefaultTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            {
              "id": "pm_abc123",
              "customerId": "cus_abc123",
              "provider": "stripe",
              "type": "CARD",
              "tokenId": "pm_1234567890",
              "isDefault": true,
              "last4": "4242",
              "brand": "visa",
              "expMonth": 12,
              "expYear": 2028,
              "cardholderName": "John Doe",
              "country": "US",
              "createdAt": "2024-01-15T10:30:00.000Z",
              "updatedAt": "2024-01-15T10:30:00.000Z"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/payment-methods/id/set-default")
                    .UsingPatch()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.PaymentMethods.SetDefaultAsync(
            new SetDefaultPaymentMethodsRequest { Id = "id" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
