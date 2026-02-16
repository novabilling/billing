# frozen_string_literal: true

module Novabilling
  module Types
    module CreditNoteResponseReason
      extend Novabilling::Internal::Types::Enum

      DUPLICATE = "DUPLICATE"
      PRODUCT_UNSATISFACTORY = "PRODUCT_UNSATISFACTORY"
      ORDER_CHANGE = "ORDER_CHANGE"
      OTHER = "OTHER"
    end
  end
end
