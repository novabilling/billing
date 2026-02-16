using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class ListTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            [
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
            ]
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/tenants/me/api-keys")
                    .UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.ApiKeys.ListAsync();
        JsonAssert.AreEqual(response, mockResponse);
    }
}
