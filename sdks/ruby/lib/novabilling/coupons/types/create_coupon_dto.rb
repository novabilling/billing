# frozen_string_literal: true

module Novabilling
  module Coupons
    module Types
      class CreateCouponDto < Internal::Types::Model
        field :code, -> { String }, optional: false, nullable: false
        field :name, -> { String }, optional: false, nullable: false
        field :description, -> { String }, optional: true, nullable: false
        field :discount_type, -> { Novabilling::Coupons::Types::CreateCouponDtoDiscountType }, optional: false, nullable: false, api_name: "discountType"
        field :discount_value, -> { Integer }, optional: false, nullable: false, api_name: "discountValue"
        field :currency, -> { String }, optional: true, nullable: false
        field :max_redemptions, -> { Integer }, optional: true, nullable: false, api_name: "maxRedemptions"
        field :applies_to_plan_ids, -> { Internal::Types::Array[String] }, optional: true, nullable: false, api_name: "appliesToPlanIds"
        field :expires_at, -> { String }, optional: true, nullable: false, api_name: "expiresAt"
        field :created_at, -> { String }, optional: true, nullable: false, api_name: "createdAt"
      end
    end
  end
end
