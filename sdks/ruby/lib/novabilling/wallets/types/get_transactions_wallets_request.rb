# frozen_string_literal: true

module Novabilling
  module Wallets
    module Types
      class GetTransactionsWalletsRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :status, -> { Novabilling::Wallets::Types::GetTransactionsWalletsRequestStatus }, optional: true, nullable: false
        field :transaction_status, -> { Novabilling::Wallets::Types::GetTransactionsWalletsRequestTransactionStatus }, optional: true, nullable: false, api_name: "transactionStatus"
        field :transaction_type, -> { Novabilling::Wallets::Types::GetTransactionsWalletsRequestTransactionType }, optional: true, nullable: false, api_name: "transactionType"
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
