using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class CreditNotesControllerUpdateTest : BaseMockServerTest
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
              "invoiceId": "clxinv123",
              "customerId": "clxcust123",
              "amount": "50.0000",
              "currency": "USD",
              "reason": "DUPLICATE",
              "status": "DRAFT",
              "metadata": {
                "key": "value"
              },
              "createdAt": "createdAt",
              "updatedAt": "updatedAt"
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/credit-notes/id")
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

        var response = await Client.CreditNotes.CreditNotesControllerUpdateAsync(
            new UpdateCreditNoteDto { Id = "id" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
