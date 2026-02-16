using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class CreateTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "name": "Production API Key",
              "scopes": [
                "read",
                "write"
              ]
            }
            """;

        const string mockResponse = """
            {
              "id": "clx1234567890",
              "key": "sk_live_abc123...",
              "name": "Production API Key",
              "scopes": [
                "read",
                "write"
              ],
              "lastUsed": "lastUsed",
              "expiresAt": "expiresAt",
              "createdAt": "createdAt"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/tenants/me/api-keys")
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

        var response = await Client.ApiKeys.CreateAsync(
            new CreateApiKeyBodyDto
            {
                Name = "Production API Key",
                Scopes = new List<string>() { "read", "write" },
            }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
