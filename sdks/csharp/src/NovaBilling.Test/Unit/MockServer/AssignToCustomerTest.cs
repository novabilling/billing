using NovaBilling;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class AssignToCustomerTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public void MockServerTest()
    {
        const string requestJson = """
            {
              "taxId": "clx1234567890"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/taxes/customer/customerId")
                    .WithHeader("Content-Type", "application/json")
                    .UsingPost()
                    .WithBodyAsJson(requestJson)
            )
            .RespondWith(WireMock.ResponseBuilders.Response.Create().WithStatusCode(200));

        Assert.DoesNotThrowAsync(async () =>
            await Client.Taxes.AssignToCustomerAsync(
                new AssignToCustomerTaxesRequest
                {
                    CustomerId = "customerId",
                    Body = new AssignTaxDto { TaxId = "clx1234567890" },
                }
            )
        );
    }
}
