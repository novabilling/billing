# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class ListTaxesRequest < Internal::Types::Model
        field :applied_by_default, -> { Internal::Types::Boolean }, optional: true, nullable: false, api_name: "appliedByDefault"
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
