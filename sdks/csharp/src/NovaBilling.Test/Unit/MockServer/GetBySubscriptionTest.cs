using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetBySubscriptionTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            {
              "data": [
                {
                  "id": "clx1234567890",
                  "transactionId": "txn_unique_123",
                  "subscriptionId": "clxsub123",
                  "code": "api_calls",
                  "timestamp": "timestamp",
                  "properties": {
                    "region": "us-east",
                    "bytes": 1024
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
                    .WithPath("/api/events/subscription/subscriptionId")
                    .UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Events.GetBySubscriptionAsync(
            new GetBySubscriptionEventsRequest { SubscriptionId = "subscriptionId" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
