# frozen_string_literal: true

module Novabilling
  module Coupons
    module Types
      class UpdateCouponDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :name, -> { String }, optional: true, nullable: false
        field :description, -> { String }, optional: true, nullable: false
        field :is_active, -> { Internal::Types::Boolean }, optional: true, nullable: false, api_name: "isActive"
        field :expires_at, -> { String }, optional: true, nullable: false, api_name: "expiresAt"
      end
    end
  end
end
