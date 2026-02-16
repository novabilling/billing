# frozen_string_literal: true

module Novabilling
  module Types
    module WalletTransactionResponseStatus
      extend Novabilling::Internal::Types::Enum

      PENDING = "PENDING"
      SETTLED = "SETTLED"
      FAILED = "FAILED"
    end
  end
end
