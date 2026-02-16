using NovaBilling;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class RemoveFromPlanTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public void MockServerTest()
    {
        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/taxes/plan/planId/taxId")
                    .UsingDelete()
            )
            .RespondWith(WireMock.ResponseBuilders.Response.Create().WithStatusCode(200));

        Assert.DoesNotThrowAsync(async () =>
            await Client.Taxes.RemoveFromPlanAsync(
                new RemoveFromPlanTaxesRequest { PlanId = "planId", TaxId = "taxId" }
            )
        );
    }
}
