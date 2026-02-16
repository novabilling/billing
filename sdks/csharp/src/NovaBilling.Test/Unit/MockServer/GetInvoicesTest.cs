using NovaBilling;
using NovaBilling.Test.Utils;
using NUnit.Framework;

namespace NovaBilling.Test.Unit.MockServer;

[TestFixture]
public class GetInvoicesTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async Task MockServerTest()
    {
        const string mockResponse = """
            [
              {
                "id": "clx1234567890",
                "invoiceNumber": "INV-2026-0001",
                "subscriptionId": "subscriptionId",
                "customerId": "clxcust123",
                "amount": "99.9900",
                "currency": "USD",
                "status": "DRAFT",
                "dueDate": "dueDate",
                "paidAt": "paidAt",
                "pdfUrl": "/uploads/invoices/inv-123.pdf",
                "metadata": {
                  "key": "value"
                },
                "customer": {
                  "id": "clx1234567890",
                  "name": "Jane Doe",
                  "email": "jane@example.com"
                },
                "createdAt": "createdAt",
                "updatedAt": "updatedAt"
              }
            ]
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/api/customers/id/invoices")
                    .UsingGet()
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Customers.GetInvoicesAsync(
            new GetInvoicesCustomersRequest { Id = "id" }
        );
        JsonAssert.AreEqual(response, mockResponse);
    }
}
