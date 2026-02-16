using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class ResetPasswordTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string requestJson = """
            {
              "token": "token",
              "newPassword": "newSecurePassword123"
            }
            """;

        const string mockResponse = """
            {
              "message": "Operation completed successfully"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/auth/reset-password")
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

        var response = await Client.Auth.ResetPasswordAsync(
            new ResetPasswordDto { Token = "token", NewPassword = "newSecurePassword123" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
