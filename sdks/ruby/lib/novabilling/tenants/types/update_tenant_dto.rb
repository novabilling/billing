# frozen_string_literal: true

module Novabilling
  module Tenants
    module Types
      class UpdateTenantDto < Internal::Types::Model
        field :name, -> { String }, optional: true, nullable: false
        field :email, -> { String }, optional: true, nullable: false
        field :webhook_url, -> { String }, optional: true, nullable: false, api_name: "webhookUrl"
        field :settings, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      end
    end
  end
end
