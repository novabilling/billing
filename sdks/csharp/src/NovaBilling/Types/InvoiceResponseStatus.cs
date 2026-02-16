using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<InvoiceResponseStatus>))]
[Serializable]
public readonly record struct InvoiceResponseStatus : IStringEnum
{
    public static readonly InvoiceResponseStatus Draft = new(Values.Draft);

    public static readonly InvoiceResponseStatus Pending = new(Values.Pending);

    public static readonly InvoiceResponseStatus Paid = new(Values.Paid);

    public static readonly InvoiceResponseStatus Failed = new(Values.Failed);

    public static readonly InvoiceResponseStatus Canceled = new(Values.Canceled);

    public InvoiceResponseStatus(string value)
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
    public static InvoiceResponseStatus FromCustom(string value)
    {
        return new InvoiceResponseStatus(value);
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

    public static bool operator ==(InvoiceResponseStatus value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(InvoiceResponseStatus value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(InvoiceResponseStatus value) => value.Value;

    public static explicit operator InvoiceResponseStatus(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Draft = "DRAFT";

        public const string Pending = "PENDING";

        public const string Paid = "PAID";

        public const string Failed = "FAILED";

        public const string Canceled = "CANCELED";
    }
}
