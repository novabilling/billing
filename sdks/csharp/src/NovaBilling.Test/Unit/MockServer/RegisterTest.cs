using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class RegisterTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "name": "John Doe",
              "email": "john@company.com",
              "password": "securePassword123",
              "companyName": "Acme Corp"
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
              },
              "apiKey": "sk_live_abc123..."
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/auth/register")
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

        var response = await Client.Auth.RegisterAsync(
            new RegisterDto
            {
                Name = "John Doe",
                Email = "john@company.com",
                Password = "securePassword123",
                CompanyName = "Acme Corp",
            }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
