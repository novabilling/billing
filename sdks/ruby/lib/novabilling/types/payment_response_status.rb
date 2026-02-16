# frozen_string_literal: true

module Novabilling
  module Types
    module PaymentResponseStatus
      extend Novabilling::Internal::Types::Enum

      PENDING = "PENDING"
      PROCESSING = "PROCESSING"
      SUCCEEDED = "SUCCEEDED"
      FAILED = "FAILED"
      REFUNDED = "REFUNDED"
    end
  end
end
