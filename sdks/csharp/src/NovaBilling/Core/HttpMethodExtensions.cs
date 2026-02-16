using global::System.Net.Http;

namespace NovaBilling.Core;

internal static class HttpMethodExtensions
{
    public static readonly HttpMethod Patch = new("PATCH");
}
