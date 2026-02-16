# frozen_string_literal: true

module Novabilling
  module PaymentProviders
    module Types
      class CreateProviderDto < Internal::Types::Model
        field :provider_name, -> { String }, optional: false, nullable: false, api_name: "providerName"
        field :credentials, -> { Internal::Types::Hash[String, Object] }, optional: false, nullable: false
        field :is_active, -> { Internal::Types::Boolean }, optional: true, nullable: false, api_name: "isActive"
        field :priority, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
