# frozen_string_literal: true

module Novabilling
  module APIKeys
    module Types
      class CreateAPIKeyBodyDto < Internal::Types::Model
        field :name, -> { String }, optional: false, nullable: false
        field :scopes, -> { Internal::Types::Array[String] }, optional: false, nullable: false
        field :expires_at, -> { String }, optional: true, nullable: false, api_name: "expiresAt"
      end
    end
  end
end
