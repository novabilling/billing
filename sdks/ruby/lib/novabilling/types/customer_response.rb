# frozen_string_literal: true

module Novabilling
  module Types
    class CustomerResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :external_id, -> { String }, optional: false, nullable: false, api_name: "externalId"
      field :email, -> { String }, optional: false, nullable: false
      field :name, -> { String }, optional: true, nullable: false
      field :country, -> { String }, optional: true, nullable: false
      field :currency, -> { String }, optional: false, nullable: false
      field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
