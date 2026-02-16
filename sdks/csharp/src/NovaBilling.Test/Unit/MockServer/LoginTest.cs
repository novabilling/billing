using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class LoginTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "email": "john@company.com",
              "password": "securePassword123"
            }
            """;

        const string mockResponse = """
            {
              "accessToken": "eyJhbGciOiJIUzI1NiIs...",
              "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
              "tenant": {
                "id": "clx1234567890",
                "name": "Acme Corp",
                "slug": "acme-corp",
                "email": "john@company.com",
                "apiKey": "sk_live_abc123...",
                "webhookUrl": "https://example.com/webhooks",
                "webhookSecret": "webhookSecret",
                "isActive": true,
                "settings": {
                  "key": "value"
                },
                "lastLoginAt": "lastLoginAt",
                "createdAt": "createdAt",
                "updatedAt": "updatedAt"
              }
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/auth/login")
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

        var response = await Client.Auth.LoginAsync(
            new LoginDto { Email = "john@company.com", Password = "securePassword123" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
