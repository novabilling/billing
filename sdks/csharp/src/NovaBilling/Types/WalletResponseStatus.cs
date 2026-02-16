using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<WalletResponseStatus>))]
[Serializable]
public readonly record struct WalletResponseStatus : IStringEnum
{
    public static readonly WalletResponseStatus Active = new(Values.Active);

    public static readonly WalletResponseStatus Terminated = new(Values.Terminated);

    public WalletResponseStatus(string value)
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
    public static WalletResponseStatus FromCustom(string value)
    {
        return new WalletResponseStatus(value);
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

    public static bool operator ==(WalletResponseStatus value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(WalletResponseStatus value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(WalletResponseStatus value) => value.Value;

    public static explicit operator WalletResponseStatus(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Active = "ACTIVE";

        public const string Terminated = "TERMINATED";
    }
}
