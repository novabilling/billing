using NovaBilling;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class RemoveFromChargeTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public void MockServerTest()
    {
        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/taxes/charge/chargeId/taxId")
                    .UsingDelete()
            )
            .RespondWith(WireMock.ResponseBuilders.Response.Create().WithStatusCode(200));

        Assert.DoesNotThrowAsync(async () =>
            await Client.Taxes.RemoveFromChargeAsync(
                new RemoveFromChargeTaxesRequest { ChargeId = "chargeId", TaxId = "taxId" }
            )
        );
    }
}
