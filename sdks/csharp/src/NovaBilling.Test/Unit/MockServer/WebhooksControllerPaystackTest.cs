using NovaBilling;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class WebhooksControllerPaystackTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public void MockServerTest()
    {
        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/webhooks/paystack")
                    .WithHeader("x-paystack-signature", "x-paystack-signature")
                    .UsingPost()
            )
            .RespondWith(WireMock.ResponseBuilders.Response.Create().WithStatusCode(200));

        Assert.DoesNotThrowAsync(async () =>
            await Client.Webhooks.WebhooksControllerPaystackAsync(
                new WebhooksControllerPaystackRequest { PaystackSignature = "x-paystack-signature" }
            )
        );
    }
}
