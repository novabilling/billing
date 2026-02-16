using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<GetTransactionsWalletsRequestTransactionStatus>))]
[Serializable]
public readonly record struct GetTransactionsWalletsRequestTransactionStatus : IStringEnum
{
    public static readonly GetTransactionsWalletsRequestTransactionStatus Purchased = new(
        Values.Purchased
    );

    public static readonly GetTransactionsWalletsRequestTransactionStatus Granted = new(
        Values.Granted
    );

    public static readonly GetTransactionsWalletsRequestTransactionStatus Voided = new(
        Values.Voided
    );

    public static readonly GetTransactionsWalletsRequestTransactionStatus Invoiced = new(
        Values.Invoiced
    );

    public GetTransactionsWalletsRequestTransactionStatus(string value)
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
    public static GetTransactionsWalletsRequestTransactionStatus FromCustom(string value)
    {
        return new GetTransactionsWalletsRequestTransactionStatus(value);
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
        GetTransactionsWalletsRequestTransactionStatus value1,
        string value2
    ) => value1.Value.Equals(value2);

    public static bool operator !=(
        GetTransactionsWalletsRequestTransactionStatus value1,
        string value2
    ) => !value1.Value.Equals(value2);

    public static explicit operator string(GetTransactionsWalletsRequestTransactionStatus value) =>
        value.Value;

    public static explicit operator GetTransactionsWalletsRequestTransactionStatus(string value) =>
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
