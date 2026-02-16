using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetPaymentsTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            [
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
            ]
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/customers/id/payments")
                    .UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Customers.GetPaymentsAsync(
            new GetPaymentsCustomersRequest { Id = "id" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
