# frozen_string_literal: true

module Novabilling
  module Types
    class ChargeGraduatedRangeResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :charge_id, -> { String }, optional: false, nullable: false, api_name: "chargeId"
      field :from_value, -> { Integer }, optional: false, nullable: false, api_name: "fromValue"
      field :to_value, -> { Integer }, optional: true, nullable: false, api_name: "toValue"
      field :per_unit_amount, -> { String }, optional: false, nullable: false, api_name: "perUnitAmount"
      field :flat_amount, -> { String }, optional: false, nullable: false, api_name: "flatAmount"
      field :order, -> { Integer }, optional: false, nullable: false
    end
  end
end
