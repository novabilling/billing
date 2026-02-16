# frozen_string_literal: true

module Novabilling
  module Types
    class AppliedCouponResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :coupon_id, -> { String }, optional: false, nullable: false, api_name: "couponId"
      field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
      field :subscription_id, -> { String }, optional: true, nullable: false, api_name: "subscriptionId"
      field :amount_off, -> { String }, optional: true, nullable: false, api_name: "amountOff"
      field :uses_remaining, -> { Integer }, optional: true, nullable: false, api_name: "usesRemaining"
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
    end
  end
end
