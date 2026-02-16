# frozen_string_literal: true

module Novabilling
  module Coupons
    module Types
      class ListCouponsRequest < Internal::Types::Model
        field :is_active, -> { Internal::Types::Boolean }, optional: true, nullable: false, api_name: "isActive"
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
