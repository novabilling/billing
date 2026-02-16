# frozen_string_literal: true

module Novabilling
  module Types
    class PaymentMethodResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
      field :provider, -> { String }, optional: false, nullable: false
      field :type, -> { String }, optional: false, nullable: false
      field :token_id, -> { String }, optional: false, nullable: false, api_name: "tokenId"
      field :is_default, -> { Internal::Types::Boolean }, optional: false, nullable: false, api_name: "isDefault"
      field :last4, -> { String }, optional: true, nullable: false
      field :brand, -> { String }, optional: true, nullable: false
      field :exp_month, -> { Integer }, optional: true, nullable: false, api_name: "expMonth"
      field :exp_year, -> { Integer }, optional: true, nullable: false, api_name: "expYear"
      field :cardholder_name, -> { String }, optional: true, nullable: false, api_name: "cardholderName"
      field :country, -> { String }, optional: true, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
