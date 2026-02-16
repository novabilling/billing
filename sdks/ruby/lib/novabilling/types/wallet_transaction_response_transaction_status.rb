# frozen_string_literal: true

module Novabilling
  module Types
    module WalletTransactionResponseTransactionStatus
      extend Novabilling::Internal::Types::Enum

      PURCHASED = "PURCHASED"
      GRANTED = "GRANTED"
      VOIDED = "VOIDED"
      INVOICED = "INVOICED"
    end
  end
end
