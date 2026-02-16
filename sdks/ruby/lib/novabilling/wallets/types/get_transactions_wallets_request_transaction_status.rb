# frozen_string_literal: true

module Novabilling
  module Wallets
    module Types
      module GetTransactionsWalletsRequestTransactionStatus
        extend Novabilling::Internal::Types::Enum

        PURCHASED = "PURCHASED"
        GRANTED = "GRANTED"
        VOIDED = "VOIDED"
        INVOICED = "INVOICED"
      end
    end
  end
end
