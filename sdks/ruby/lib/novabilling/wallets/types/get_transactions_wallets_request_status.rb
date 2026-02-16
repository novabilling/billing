# frozen_string_literal: true

module Novabilling
  module Wallets
    module Types
      module GetTransactionsWalletsRequestStatus
        extend Novabilling::Internal::Types::Enum

        PENDING = "PENDING"
        SETTLED = "SETTLED"
        FAILED = "FAILED"
      end
    end
  end
end
