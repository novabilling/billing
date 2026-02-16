# frozen_string_literal: true

module Novabilling
  module Types
    class WalletTransactionResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :wallet_id, -> { String }, optional: false, nullable: false, api_name: "walletId"
      field :transaction_type, -> { Novabilling::Types::WalletTransactionResponseTransactionType }, optional: false, nullable: false, api_name: "transactionType"
      field :status, -> { Novabilling::Types::WalletTransactionResponseStatus }, optional: false, nullable: false
      field :transaction_status, -> { Novabilling::Types::WalletTransactionResponseTransactionStatus }, optional: false, nullable: false, api_name: "transactionStatus"
      field :credit_amount, -> { String }, optional: false, nullable: false, api_name: "creditAmount"
      field :amount, -> { String }, optional: false, nullable: false
      field :invoice_id, -> { String }, optional: true, nullable: false, api_name: "invoiceId"
      field :settled_at, -> { String }, optional: true, nullable: false, api_name: "settledAt"
      field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
    end
  end
end
