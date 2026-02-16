# frozen_string_literal: true

module Novabilling
  module Types
    class CouponResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :code, -> { String }, optional: false, nullable: false
      field :name, -> { String }, optional: false, nullable: false
      field :description, -> { String }, optional: true, nullable: false
      field :discount_type, -> { Novabilling::Types::CouponResponseDiscountType }, optional: false, nullable: false, api_name: "discountType"
      field :discount_value, -> { String }, optional: false, nullable: false, api_name: "discountValue"
      field :currency, -> { String }, optional: true, nullable: false
      field :max_redemptions, -> { Integer }, optional: true, nullable: false, api_name: "maxRedemptions"
      field :redemption_count, -> { Integer }, optional: false, nullable: false, api_name: "redemptionCount"
      field :applies_to_plan_ids, -> { Internal::Types::Array[String] }, optional: false, nullable: false, api_name: "appliesToPlanIds"
      field :is_active, -> { Internal::Types::Boolean }, optional: false, nullable: false, api_name: "isActive"
      field :expires_at, -> { String }, optional: true, nullable: false, api_name: "expiresAt"
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
