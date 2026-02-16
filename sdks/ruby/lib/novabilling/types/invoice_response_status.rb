# frozen_string_literal: true

module Novabilling
  module Types
    module InvoiceResponseStatus
      extend Novabilling::Internal::Types::Enum

      DRAFT = "DRAFT"
      PENDING = "PENDING"
      PAID = "PAID"
      FAILED = "FAILED"
      CANCELED = "CANCELED"
    end
  end
end
