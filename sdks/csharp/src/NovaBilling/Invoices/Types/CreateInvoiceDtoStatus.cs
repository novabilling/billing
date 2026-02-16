using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreateInvoiceDtoStatus>))]
[Serializable]
public readonly record struct CreateInvoiceDtoStatus : IStringEnum
{
    public static readonly CreateInvoiceDtoStatus Draft = new(Values.Draft);

    public static readonly CreateInvoiceDtoStatus Pending = new(Values.Pending);

    public static readonly CreateInvoiceDtoStatus Paid = new(Values.Paid);

    public static readonly CreateInvoiceDtoStatus Failed = new(Values.Failed);

    public static readonly CreateInvoiceDtoStatus Canceled = new(Values.Canceled);

    public CreateInvoiceDtoStatus(string value)
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
    public static CreateInvoiceDtoStatus FromCustom(string value)
    {
        return new CreateInvoiceDtoStatus(value);
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

    public static bool operator ==(CreateInvoiceDtoStatus value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreateInvoiceDtoStatus value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreateInvoiceDtoStatus value) => value.Value;

    public static explicit operator CreateInvoiceDtoStatus(string value) => new(value);

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
