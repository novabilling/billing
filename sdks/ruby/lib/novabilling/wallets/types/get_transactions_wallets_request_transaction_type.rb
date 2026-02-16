# frozen_string_literal: true

module Novabilling
  module Wallets
    module Types
      module GetTransactionsWalletsRequestTransactionType
        extend Novabilling::Internal::Types::Enum

        INBOUND = "INBOUND"
        OUTBOUND = "OUTBOUND"
      end
    end
  end
end
