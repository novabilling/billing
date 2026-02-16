using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class CreateCheckoutTest_ : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            {
              "checkoutUrl": "https://paystack.com/pay/abc123",
              "paymentId": "clxpay123",
              "provider": "paystack",
              "expiresAt": "expiresAt"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/portal/customers/externalId/invoices/invoiceId/checkout")
                    .UsingPost()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Portal.CreateCheckoutAsync(
            new CreateCheckoutPortalRequest { ExternalId = "externalId", InvoiceId = "invoiceId" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
