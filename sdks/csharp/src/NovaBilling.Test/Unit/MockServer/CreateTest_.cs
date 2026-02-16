using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class CreateTest_ : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "customerId": "clx_customer_123",
              "planId": "clx_plan_456"
            }
            """;

        const string mockResponse = """
            {
              "id": "clx1234567890",
              "customerId": "clx_customer_123",
              "planId": "clx_plan_456",
              "overriddenPrices": {
                "0": {
                  "currency": "USD",
                  "amount": 49.99
                }
              },
              "overriddenMinimumCommitment": 500,
              "overriddenCharges": {
                "key": "value"
              },
              "metadata": {
                "key": "value"
              },
              "createdAt": "2024-01-15T09:30:00.000Z",
              "updatedAt": "2024-01-15T09:30:00.000Z"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/plan-overrides")
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

        var response = await Client.PlanOverrides.CreateAsync(
            new CreatePlanOverrideDto { CustomerId = "clx_customer_123", PlanId = "clx_plan_456" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
