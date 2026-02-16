# frozen_string_literal: true

module Novabilling
  module Types
    class TenantResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :name, -> { String }, optional: false, nullable: false
      field :slug, -> { String }, optional: false, nullable: false
      field :email, -> { String }, optional: false, nullable: false
      field :api_key, -> { String }, optional: false, nullable: false, api_name: "apiKey"
      field :webhook_url, -> { String }, optional: true, nullable: false, api_name: "webhookUrl"
      field :webhook_secret, -> { String }, optional: true, nullable: false, api_name: "webhookSecret"
      field :is_active, -> { Internal::Types::Boolean }, optional: false, nullable: false, api_name: "isActive"
      field :settings, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      field :last_login_at, -> { String }, optional: true, nullable: false, api_name: "lastLoginAt"
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
