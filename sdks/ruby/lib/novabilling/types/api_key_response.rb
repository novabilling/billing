# frozen_string_literal: true

module Novabilling
  module Types
    class APIKeyResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :key, -> { String }, optional: false, nullable: false
      field :name, -> { String }, optional: false, nullable: false
      field :scopes, -> { Internal::Types::Array[String] }, optional: false, nullable: false
      field :last_used, -> { String }, optional: true, nullable: false, api_name: "lastUsed"
      field :expires_at, -> { String }, optional: true, nullable: false, api_name: "expiresAt"
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
    end
  end
end
