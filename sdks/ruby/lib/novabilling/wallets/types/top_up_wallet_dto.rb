# frozen_string_literal: true

module Novabilling
  module Wallets
    module Types
      class TopUpWalletDto < Internal::Types::Model
        field :wallet_id, -> { String }, optional: false, nullable: false, api_name: "walletId"
        field :paid_credits, -> { Integer }, optional: true, nullable: false, api_name: "paidCredits"
        field :granted_credits, -> { Integer }, optional: true, nullable: false, api_name: "grantedCredits"
        field :voided_credits, -> { Integer }, optional: true, nullable: false, api_name: "voidedCredits"
        field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      end
    end
  end
end
