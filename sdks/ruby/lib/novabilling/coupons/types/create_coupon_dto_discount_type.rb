# frozen_string_literal: true

module Novabilling
  module Coupons
    module Types
      module CreateCouponDtoDiscountType
        extend Novabilling::Internal::Types::Enum

        PERCENTAGE = "PERCENTAGE"
        FIXED_AMOUNT = "FIXED_AMOUNT"
      end
    end
  end
end
