using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetTransactionsTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            {
              "data": [
                {
                  "id": "clx1234567890",
                  "walletId": "clxwallet123",
                  "transactionType": "INBOUND",
                  "status": "PENDING",
                  "transactionStatus": "PURCHASED",
                  "creditAmount": "50.0000",
                  "amount": "50.0000",
                  "invoiceId": "invoiceId",
                  "settledAt": "settledAt",
                  "metadata": {
                    "key": "value"
                  },
                  "createdAt": "createdAt"
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
                    .WithPath("/api/wallets/id/transactions")
                    .UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Wallets.GetTransactionsAsync(
            new GetTransactionsWalletsRequest { Id = "id" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
