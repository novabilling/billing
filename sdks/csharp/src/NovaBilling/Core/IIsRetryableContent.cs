namespace NovaBilling.Core;

public interface IIsRetryableContent
{
    public bool IsRetryable { get; }
}
