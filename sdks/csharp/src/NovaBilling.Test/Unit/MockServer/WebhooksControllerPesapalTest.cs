using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class WebhooksControllerPesapalTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public void MockServerTest()
    {
        Server
            .Given(
                WireMock.RequestBuilders.Request.Create().WithPath("/webhooks/pesapal").UsingPost()
            )
            .RespondWith(WireMock.ResponseBuilders.Response.Create().WithStatusCode(200));

        Assert.DoesNotThrowAsync(async () =>
            await Client.Webhooks.WebhooksControllerPesapalAsync()
        );
    }
}
