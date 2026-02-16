# frozen_string_literal: true

module Novabilling
  module Types
    class PaymentProviderResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :provider_name, -> { String }, optional: false, nullable: false, api_name: "providerName"
      field :is_active, -> { Internal::Types::Boolean }, optional: false, nullable: false, api_name: "isActive"
      field :priority, -> { Integer }, optional: false, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
