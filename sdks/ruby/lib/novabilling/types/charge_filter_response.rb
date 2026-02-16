# frozen_string_literal: true

module Novabilling
  module Types
    class ChargeFilterResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :charge_id, -> { String }, optional: false, nullable: false, api_name: "chargeId"
      field :key, -> { String }, optional: false, nullable: false
      field :values, -> { Internal::Types::Array[String] }, optional: false, nullable: false
      field :properties, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
    end
  end
end
