# frozen_string_literal: true

module Novabilling
  module Coupons
    module Types
      class RemoveAppliedCouponsRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
