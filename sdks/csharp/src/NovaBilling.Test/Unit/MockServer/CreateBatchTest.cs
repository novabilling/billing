using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class CreateBatchTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "events": [
                {
                  "transactionId": "evt_12345",
                  "subscriptionId": "sub_abc123",
                  "code": "api_calls"
                }
              ]
            }
            """;

        const string mockResponse = """
            {
              "received": 5,
              "processed": 5,
              "duplicates": 0
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/events/batch")
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

        var response = await Client.Events.CreateBatchAsync(
            new BatchEventsDto
            {
                Events = new List<CreateEventDto>()
                {
                    new CreateEventDto
                    {
                        TransactionId = "evt_12345",
                        SubscriptionId = "sub_abc123",
                        Code = "api_calls",
                    },
                },
            }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
