# frozen_string_literal: true

module Novabilling
  module Types
    module CouponResponseDiscountType
      extend Novabilling::Internal::Types::Enum

      PERCENTAGE = "PERCENTAGE"
      FIXED_AMOUNT = "FIXED_AMOUNT"
    end
  end
end
