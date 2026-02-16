using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class UpdateMeTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {}
            """;

        const string mockResponse = """
            {
              "id": "clx1234567890",
              "name": "Acme Corp",
              "slug": "acme-corp",
              "email": "john@company.com",
              "apiKey": "sk_live_abc123...",
              "webhookUrl": "https://example.com/webhooks",
              "webhookSecret": "whsec_abc123...",
              "isActive": true,
              "settings": {
                "key": "value"
              },
              "lastLoginAt": "lastLoginAt",
              "createdAt": "createdAt",
              "updatedAt": "updatedAt"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/tenants/me")
                    .WithHeader("Content-Type", "application/json")
                    .UsingPatch()
                    .WithBodyAsJson(requestJson)
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Tenants.UpdateMeAsync(new UpdateTenantDto());
        JsonAssert.AreEqual(response, mockResponse);
    }
}
