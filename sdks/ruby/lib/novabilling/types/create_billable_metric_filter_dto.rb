# frozen_string_literal: true

module Novabilling
  module Types
    class CreateBillableMetricFilterDto < Internal::Types::Model
      field :key, -> { String }, optional: false, nullable: false
      field :values, -> { Internal::Types::Array[String] }, optional: false, nullable: false
    end
  end
end
