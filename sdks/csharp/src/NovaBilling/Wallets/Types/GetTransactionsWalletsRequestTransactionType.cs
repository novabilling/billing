using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<GetTransactionsWalletsRequestTransactionType>))]
[Serializable]
public readonly record struct GetTransactionsWalletsRequestTransactionType : IStringEnum
{
    public static readonly GetTransactionsWalletsRequestTransactionType Inbound = new(
        Values.Inbound
    );

    public static readonly GetTransactionsWalletsRequestTransactionType Outbound = new(
        Values.Outbound
    );

    public GetTransactionsWalletsRequestTransactionType(string value)
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
    public static GetTransactionsWalletsRequestTransactionType FromCustom(string value)
    {
        return new GetTransactionsWalletsRequestTransactionType(value);
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
        GetTransactionsWalletsRequestTransactionType value1,
        string value2
    ) => value1.Value.Equals(value2);

    public static bool operator !=(
        GetTransactionsWalletsRequestTransactionType value1,
        string value2
    ) => !value1.Value.Equals(value2);

    public static explicit operator string(GetTransactionsWalletsRequestTransactionType value) =>
        value.Value;

    public static explicit operator GetTransactionsWalletsRequestTransactionType(string value) =>
        new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Inbound = "INBOUND";

        public const string Outbound = "OUTBOUND";
    }
}
