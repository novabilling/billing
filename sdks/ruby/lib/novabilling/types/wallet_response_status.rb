# frozen_string_literal: true

module Novabilling
  module Types
    module WalletResponseStatus
      extend Novabilling::Internal::Types::Enum

      ACTIVE = "ACTIVE"
      TERMINATED = "TERMINATED"
    end
  end
end
