# frozen_string_literal: true

module Novabilling
  module Types
    class TopUpResponse < Internal::Types::Model
      field :transactions, -> { Internal::Types::Array[Novabilling::Types::WalletTransactionResponse] }, optional: false, nullable: false
      field :wallet, -> { Novabilling::Types::WalletResponse }, optional: false, nullable: false
    end
  end
end
