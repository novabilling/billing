using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<GetTransactionsWalletsRequestStatus>))]
[Serializable]
public readonly record struct GetTransactionsWalletsRequestStatus : IStringEnum
{
    public static readonly GetTransactionsWalletsRequestStatus Pending = new(Values.Pending);

    public static readonly GetTransactionsWalletsRequestStatus Settled = new(Values.Settled);

    public static readonly GetTransactionsWalletsRequestStatus Failed = new(Values.Failed);

    public GetTransactionsWalletsRequestStatus(string value)
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
    public static GetTransactionsWalletsRequestStatus FromCustom(string value)
    {
        return new GetTransactionsWalletsRequestStatus(value);
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

    public static bool operator ==(GetTransactionsWalletsRequestStatus value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(GetTransactionsWalletsRequestStatus value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(GetTransactionsWalletsRequestStatus value) =>
        value.Value;

    public static explicit operator GetTransactionsWalletsRequestStatus(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Pending = "PENDING";

        public const string Settled = "SETTLED";

        public const string Failed = "FAILED";
    }
}
