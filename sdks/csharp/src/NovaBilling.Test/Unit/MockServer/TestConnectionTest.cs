using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class TestConnectionTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            {
              "success": true,
              "message": "Connection successful"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/payment-providers/id/test")
                    .UsingPost()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.PaymentProviders.TestConnectionAsync(
            new TestConnectionPaymentProvidersRequest { Id = "id" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
