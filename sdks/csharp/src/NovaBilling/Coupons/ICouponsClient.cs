namespace NovaBilling;

public partial interface ICouponsClient
{
    /// <summary>
    /// Retrieve a paginated list of coupons.
    /// </summary>
    WithRawResponseTask<PaginatedCouponResponse> ListAsync(
        ListCouponsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a new discount coupon.
    /// </summary>
    WithRawResponseTask<CouponResponse> CreateAsync(
        CreateCouponDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<CouponResponse> GetAsync(
        GetCouponsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Delete or deactivate a coupon.
    /// </summary>
    WithRawResponseTask<CouponResponse> DeleteAsync(
        DeleteCouponsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<CouponResponse> UpdateAsync(
        UpdateCouponDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Apply a coupon to a specific customer, optionally linked to a subscription.
    /// </summary>
    WithRawResponseTask<AppliedCouponResponse> ApplyAsync(
        ApplyCouponDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    Task RemoveAppliedAsync(
        RemoveAppliedCouponsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
