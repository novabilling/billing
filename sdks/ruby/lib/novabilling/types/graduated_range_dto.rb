# frozen_string_literal: true

module Novabilling
  module Types
    class GraduatedRangeDto < Internal::Types::Model
      field :from_value, -> { Integer }, optional: false, nullable: false, api_name: "fromValue"
      field :to_value, -> { Integer }, optional: true, nullable: false, api_name: "toValue"
      field :per_unit_amount, -> { Integer }, optional: false, nullable: false, api_name: "perUnitAmount"
      field :flat_amount, -> { Integer }, optional: true, nullable: false, api_name: "flatAmount"
    end
  end
end
