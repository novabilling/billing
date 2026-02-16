# frozen_string_literal: true

module Novabilling
  module Wallets
    module Types
      class CreateWalletDto < Internal::Types::Model
        field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
        field :name, -> { String }, optional: true, nullable: false
        field :currency, -> { String }, optional: false, nullable: false
        field :rate_amount, -> { Integer }, optional: true, nullable: false, api_name: "rateAmount"
        field :paid_credits, -> { Integer }, optional: true, nullable: false, api_name: "paidCredits"
        field :granted_credits, -> { Integer }, optional: true, nullable: false, api_name: "grantedCredits"
        field :expiration_at, -> { String }, optional: true, nullable: false, api_name: "expirationAt"
        field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
        field :created_at, -> { String }, optional: true, nullable: false, api_name: "createdAt"
      end
    end
  end
end
