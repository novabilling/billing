# frozen_string_literal: true

module Novabilling
  module Types
    class ChargeFilterDto < Internal::Types::Model
      field :key, -> { String }, optional: false, nullable: false
      field :values, -> { Internal::Types::Array[String] }, optional: false, nullable: false
      field :properties, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
    end
  end
end
