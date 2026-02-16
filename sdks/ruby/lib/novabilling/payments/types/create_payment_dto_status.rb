# frozen_string_literal: true

module Novabilling
  module Payments
    module Types
      module CreatePaymentDtoStatus
        extend Novabilling::Internal::Types::Enum

        PROCESSING = "PROCESSING"
        SUCCEEDED = "SUCCEEDED"
        FAILED = "FAILED"
        REFUNDED = "REFUNDED"
      end
    end
  end
end
