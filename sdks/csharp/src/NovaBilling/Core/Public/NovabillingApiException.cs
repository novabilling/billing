namespace NovaBilling;

/// <summary>
/// Base exception class for all exceptions thrown by the SDK.
/// </summary>
public class NovabillingApiException(string message, Exception? innerException = null)
    : Exception(message, innerException);
