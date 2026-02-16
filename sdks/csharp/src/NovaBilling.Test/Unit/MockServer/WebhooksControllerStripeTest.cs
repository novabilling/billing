using NovaBilling;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class WebhooksControllerStripeTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public void MockServerTest()
    {
        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/webhooks/stripe")
                    .WithHeader("stripe-signature", "stripe-signature")
                    .UsingPost()
            )
            .RespondWith(WireMock.ResponseBuilders.Response.Create().WithStatusCode(200));

        Assert.DoesNotThrowAsync(async () =>
            await Client.Webhooks.WebhooksControllerStripeAsync(
                new WebhooksControllerStripeRequest { StripeSignature = "stripe-signature" }
            )
        );
    }
}
