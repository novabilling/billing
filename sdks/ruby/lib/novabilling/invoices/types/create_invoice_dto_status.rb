# frozen_string_literal: true

module Novabilling
  module Invoices
    module Types
      module CreateInvoiceDtoStatus
        extend Novabilling::Internal::Types::Enum

        DRAFT = "DRAFT"
        PENDING = "PENDING"
        PAID = "PAID"
        FAILED = "FAILED"
        CANCELED = "CANCELED"
      end
    end
  end
end
