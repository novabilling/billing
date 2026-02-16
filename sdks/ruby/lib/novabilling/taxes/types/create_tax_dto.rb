# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class CreateTaxDto < Internal::Types::Model
        field :name, -> { String }, optional: false, nullable: false
        field :code, -> { String }, optional: false, nullable: false
        field :rate, -> { Integer }, optional: false, nullable: false
        field :description, -> { String }, optional: true, nullable: false
        field :applied_by_default, -> { Internal::Types::Boolean }, optional: true, nullable: false, api_name: "appliedByDefault"
      end
    end
  end
end
