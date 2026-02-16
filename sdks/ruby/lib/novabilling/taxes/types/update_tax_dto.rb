# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class UpdateTaxDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :name, -> { String }, optional: true, nullable: false
        field :rate, -> { Integer }, optional: true, nullable: false
        field :description, -> { String }, optional: true, nullable: false
        field :applied_by_default, -> { Internal::Types::Boolean }, optional: true, nullable: false, api_name: "appliedByDefault"
      end
    end
  end
end
