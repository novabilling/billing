using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<ListWalletsRequestStatus>))]
[Serializable]
public readonly record struct ListWalletsRequestStatus : IStringEnum
{
    public static readonly ListWalletsRequestStatus Active = new(Values.Active);

    public static readonly ListWalletsRequestStatus Terminated = new(Values.Terminated);

    public ListWalletsRequestStatus(string value)
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
    public static ListWalletsRequestStatus FromCustom(string value)
    {
        return new ListWalletsRequestStatus(value);
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

    public static bool operator ==(ListWalletsRequestStatus value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(ListWalletsRequestStatus value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(ListWalletsRequestStatus value) => value.Value;

    public static explicit operator ListWalletsRequestStatus(string value) => new(value);

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
