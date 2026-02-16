# frozen_string_literal: true

module Novabilling
  module Types
    module WalletTransactionResponseTransactionType
      extend Novabilling::Internal::Types::Enum

      INBOUND = "INBOUND"
      OUTBOUND = "OUTBOUND"
    end
  end
end
