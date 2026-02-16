using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class TaxesControllerGetCustomerTaxesTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            [
              {
                "id": "clx1234567890",
                "name": "VAT",
                "code": "vat_18",
                "rate": "18.0000",
                "description": "Value Added Tax",
                "appliedByDefault": true,
                "createdAt": "createdAt",
                "updatedAt": "updatedAt"
              }
            ]
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/taxes/customer/customerId")
                    .UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Taxes.TaxesControllerGetCustomerTaxesAsync(
            new TaxesControllerGetCustomerTaxesRequest { CustomerId = "customerId" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
