using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetPaymentsTest_ : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            {
              "data": [
                {
                  "id": "clx1234567890",
                  "invoiceId": "clxinv123",
                  "provider": "paystack",
                  "providerTransactionId": "PAY_txn_abc123",
                  "amount": "99.9900",
                  "currency": "USD",
                  "status": "PENDING",
                  "failureReason": "Insufficient funds",
                  "metadata": {
                    "key": "value"
                  },
                  "createdAt": "createdAt",
                  "updatedAt": "updatedAt"
                }
              ],
              "meta": {
                "total": 150,
                "page": 1,
                "limit": 20,
                "totalPages": 8
              }
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/portal/customers/externalId/payments")
                    .UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Portal.GetPaymentsAsync(
            new GetPaymentsPortalRequest { ExternalId = "externalId" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
