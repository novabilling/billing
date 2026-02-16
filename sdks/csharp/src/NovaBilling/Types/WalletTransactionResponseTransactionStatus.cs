using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<WalletTransactionResponseTransactionStatus>))]
[Serializable]
public readonly record struct WalletTransactionResponseTransactionStatus : IStringEnum
{
    public static readonly WalletTransactionResponseTransactionStatus Purchased = new(
        Values.Purchased
    );

    public static readonly WalletTransactionResponseTransactionStatus Granted = new(Values.Granted);

    public static readonly WalletTransactionResponseTransactionStatus Voided = new(Values.Voided);

    public static readonly WalletTransactionResponseTransactionStatus Invoiced = new(
        Values.Invoiced
    );

    public WalletTransactionResponseTransactionStatus(string value)
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
    public static WalletTransactionResponseTransactionStatus FromCustom(string value)
    {
        return new WalletTransactionResponseTransactionStatus(value);
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

    public static bool operator ==(
        WalletTransactionResponseTransactionStatus value1,
        string value2
    ) => value1.Value.Equals(value2);

    public static bool operator !=(
        WalletTransactionResponseTransactionStatus value1,
        string value2
    ) => !value1.Value.Equals(value2);

    public static explicit operator string(WalletTransactionResponseTransactionStatus value) =>
        value.Value;

    public static explicit operator WalletTransactionResponseTransactionStatus(string value) =>
        new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Purchased = "PURCHASED";

        public const string Granted = "GRANTED";

        public const string Voided = "VOIDED";

        public const string Invoiced = "INVOICED";
    }
}
