using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class CancelTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "cancelAt": "now"
            }
            """;

        const string mockResponse = """
            {
              "id": "clx1234567890",
              "externalId": "ext_sub_123",
              "customerId": "clxcust123",
              "planId": "clxplan123",
              "previousPlanId": "previousPlanId",
              "status": "ACTIVE",
              "currency": "USD",
              "billingTiming": "IN_ADVANCE",
              "currentPeriodStart": "currentPeriodStart",
              "currentPeriodEnd": "currentPeriodEnd",
              "cancelAt": "cancelAt",
              "canceledAt": "canceledAt",
              "trialStart": "trialStart",
              "trialEnd": "trialEnd",
              "startedAt": "startedAt",
              "metadata": {
                "key": "value"
              },
              "customer": {
                "id": "clx1234567890",
                "name": "Jane Doe",
                "email": "jane@example.com"
              },
              "plan": {
                "id": "clxplan123",
                "name": "Premium Monthly",
                "billingInterval": "HOURLY"
              },
              "createdAt": "createdAt",
              "updatedAt": "updatedAt"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/subscriptions/id/cancel")
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

        var response = await Client.Subscriptions.CancelAsync(
            new CancelSubscriptionDto { Id = "id", CancelAt = CancelSubscriptionDtoCancelAt.Now }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
