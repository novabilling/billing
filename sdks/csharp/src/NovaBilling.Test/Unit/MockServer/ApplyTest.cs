using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class ApplyTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "couponId": "couponId",
              "customerId": "customerId"
            }
            """;

        const string mockResponse = """
            {
              "id": "id",
              "couponId": "couponId",
              "customerId": "customerId",
              "subscriptionId": "subscriptionId",
              "amountOff": "20.0000",
              "usesRemaining": 3,
              "createdAt": "createdAt"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/coupons/apply")
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

        var response = await Client.Coupons.ApplyAsync(
            new ApplyCouponDto { CouponId = "couponId", CustomerId = "customerId" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
