# frozen_string_literal: true

module Novabilling
  module Types
    class PaginatedWalletTransactionResponse < Internal::Types::Model
      field :data, -> { Internal::Types::Array[Novabilling::Types::WalletTransactionResponse] }, optional: false, nullable: false
      field :meta, -> { Novabilling::Types::PaginationMeta }, optional: false, nullable: false
    end
  end
end
