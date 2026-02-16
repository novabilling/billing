# frozen_string_literal: true

module Novabilling
  module PaymentMethods
    module Types
      class CreatePaymentMethodDto < Internal::Types::Model
        field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
        field :provider, -> { String }, optional: false, nullable: false
        field :type, -> { Novabilling::PaymentMethods::Types::CreatePaymentMethodDtoType }, optional: true, nullable: false
        field :token_id, -> { String }, optional: false, nullable: false, api_name: "tokenId"
        field :last4, -> { String }, optional: true, nullable: false
        field :brand, -> { String }, optional: true, nullable: false
        field :exp_month, -> { Integer }, optional: true, nullable: false, api_name: "expMonth"
        field :exp_year, -> { Integer }, optional: true, nullable: false, api_name: "expYear"
        field :cardholder_name, -> { String }, optional: true, nullable: false, api_name: "cardholderName"
        field :country, -> { String }, optional: true, nullable: false
      end
    end
  end
end
