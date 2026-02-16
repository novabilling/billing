# frozen_string_literal: true

module Novabilling
  module Types
    class TaxResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :name, -> { String }, optional: false, nullable: false
      field :code, -> { String }, optional: false, nullable: false
      field :rate, -> { String }, optional: false, nullable: false
      field :description, -> { String }, optional: true, nullable: false
      field :applied_by_default, -> { Internal::Types::Boolean }, optional: false, nullable: false, api_name: "appliedByDefault"
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
