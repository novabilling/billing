# frozen_string_literal: true

module Novabilling
  module Portal
    module Types
      module GetInvoicesPortalRequestStatus
        extend Novabilling::Internal::Types::Enum

        PENDING = "PENDING"
        PAID = "PAID"
        FAILED = "FAILED"
        CANCELED = "CANCELED"
      end
    end
  end
end
