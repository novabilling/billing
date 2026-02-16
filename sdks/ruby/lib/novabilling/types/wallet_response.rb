# frozen_string_literal: true

module Novabilling
  module Types
    class WalletResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
      field :name, -> { String }, optional: true, nullable: false
      field :currency, -> { String }, optional: false, nullable: false
      field :rate_amount, -> { String }, optional: false, nullable: false, api_name: "rateAmount"
      field :credits_balance, -> { String }, optional: false, nullable: false, api_name: "creditsBalance"
      field :balance, -> { String }, optional: false, nullable: false
      field :consumed_credits, -> { String }, optional: false, nullable: false, api_name: "consumedCredits"
      field :consumed_amount, -> { String }, optional: false, nullable: false, api_name: "consumedAmount"
      field :status, -> { Novabilling::Types::WalletResponseStatus }, optional: false, nullable: false
      field :expiration_at, -> { String }, optional: true, nullable: false, api_name: "expirationAt"
      field :terminated_at, -> { String }, optional: true, nullable: false, api_name: "terminatedAt"
      field :customer, -> { Novabilling::Types::WalletCustomerResponse }, optional: true, nullable: false
      field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
