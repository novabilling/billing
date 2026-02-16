using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class CreateTransactionTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "walletId": "wallet_id"
            }
            """;

        const string mockResponse = """
            {
              "transactions": [
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
              "wallet": {
                "id": "clx1234567890",
                "customerId": "clxcust123",
                "name": "Main Wallet",
                "currency": "USD",
                "rateAmount": "1.0000",
                "creditsBalance": "100.0000",
                "balance": "100.0000",
                "consumedCredits": "50.0000",
                "consumedAmount": "50.0000",
                "status": "ACTIVE",
                "expirationAt": "expirationAt",
                "terminatedAt": "terminatedAt",
                "customer": {
                  "id": "clx1234567890",
                  "name": "Jane Doe",
                  "email": "jane@example.com"
                },
                "metadata": {
                  "key": "value"
                },
                "createdAt": "createdAt",
                "updatedAt": "updatedAt"
              }
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/wallets/transactions")
                    .WithHeader("Content-Type", "application/json")
                    .UsingPost()
                    .WithBodyAsJson(requestJson)
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Wallets.CreateTransactionAsync(
            new TopUpWalletDto { WalletId = "wallet_id" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
