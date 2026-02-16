using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class RefreshTokenTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "refreshToken": "refreshToken"
            }
            """;

        const string mockResponse = """
            {
              "accessToken": "eyJhbGciOiJIUzI1NiIs...",
              "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/auth/refresh")
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

        var response = await Client.Auth.RefreshTokenAsync(
            new RefreshTokenDto { RefreshToken = "refreshToken" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
