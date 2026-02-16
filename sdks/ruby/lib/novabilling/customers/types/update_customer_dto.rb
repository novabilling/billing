# frozen_string_literal: true

module Novabilling
  module Customers
    module Types
      class UpdateCustomerDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :external_id, -> { String }, optional: true, nullable: false, api_name: "externalId"
        field :email, -> { String }, optional: true, nullable: false
        field :name, -> { String }, optional: true, nullable: false
        field :country, -> { String }, optional: true, nullable: false
        field :currency, -> { String }, optional: true, nullable: false
        field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
        field :net_payment_terms, -> { Integer }, optional: true, nullable: false, api_name: "netPaymentTerms"
        field :created_at, -> { String }, optional: true, nullable: false, api_name: "createdAt"
      end
    end
  end
end
