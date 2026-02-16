# frozen_string_literal: true

module Novabilling
  module Coupons
    module Types
      class ApplyCouponDto < Internal::Types::Model
        field :coupon_id, -> { String }, optional: false, nullable: false, api_name: "couponId"
        field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
        field :subscription_id, -> { String }, optional: true, nullable: false, api_name: "subscriptionId"
        field :uses_remaining, -> { Integer }, optional: true, nullable: false, api_name: "usesRemaining"
      end
    end
  end
end
