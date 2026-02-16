# frozen_string_literal: true

module Novabilling
  module Wallets
    module Types
      module ListWalletsRequestStatus
        extend Novabilling::Internal::Types::Enum

        ACTIVE = "ACTIVE"
        TERMINATED = "TERMINATED"
      end
    end
  end
end
