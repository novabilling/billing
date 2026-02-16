using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<GetInvoicesPortalRequestStatus>))]
[Serializable]
public readonly record struct GetInvoicesPortalRequestStatus : IStringEnum
{
    public static readonly GetInvoicesPortalRequestStatus Pending = new(Values.Pending);

    public static readonly GetInvoicesPortalRequestStatus Paid = new(Values.Paid);

    public static readonly GetInvoicesPortalRequestStatus Failed = new(Values.Failed);

    public static readonly GetInvoicesPortalRequestStatus Canceled = new(Values.Canceled);

    public GetInvoicesPortalRequestStatus(string value)
    {
        Value = value;
    }

    /// <summary>
    /// The string value of the enum.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Create a string enum with the given value.
    /// </summary>
    public static GetInvoicesPortalRequestStatus FromCustom(string value)
    {
        return new GetInvoicesPortalRequestStatus(value);
    }

    public bool Equals(string? other)
    {
        return Value.Equals(other);
    }

    /// <summary>
    /// Returns the string value of the enum.
    /// </summary>
    public override string ToString()
    {
        return Value;
    }

    public static bool operator ==(GetInvoicesPortalRequestStatus value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(GetInvoicesPortalRequestStatus value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(GetInvoicesPortalRequestStatus value) => value.Value;

    public static explicit operator GetInvoicesPortalRequestStatus(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Pending = "PENDING";

        public const string Paid = "PAID";

        public const string Failed = "FAILED";

        public const string Canceled = "CANCELED";
    }
}
