using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreditNoteResponseStatus>))]
[Serializable]
public readonly record struct CreditNoteResponseStatus : IStringEnum
{
    public static readonly CreditNoteResponseStatus Draft = new(Values.Draft);

    public static readonly CreditNoteResponseStatus Finalized = new(Values.Finalized);

    public static readonly CreditNoteResponseStatus Voided = new(Values.Voided);

    public CreditNoteResponseStatus(string value)
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
    public static CreditNoteResponseStatus FromCustom(string value)
    {
        return new CreditNoteResponseStatus(value);
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

    public static bool operator ==(CreditNoteResponseStatus value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreditNoteResponseStatus value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreditNoteResponseStatus value) => value.Value;

    public static explicit operator CreditNoteResponseStatus(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Draft = "DRAFT";

        public const string Finalized = "FINALIZED";

        public const string Voided = "VOIDED";
    }
}
