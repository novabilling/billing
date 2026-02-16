using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetSubscriptionsTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            [
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
            ]
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/customers/id/subscriptions")
                    .UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Customers.GetSubscriptionsAsync(
            new GetSubscriptionsCustomersRequest { Id = "id" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
