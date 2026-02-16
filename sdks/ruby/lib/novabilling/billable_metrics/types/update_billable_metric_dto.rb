# frozen_string_literal: true

module Novabilling
  module BillableMetrics
    module Types
      class UpdateBillableMetricDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :name, -> { String }, optional: true, nullable: false
        field :description, -> { String }, optional: true, nullable: false
        field :field_name, -> { String }, optional: true, nullable: false, api_name: "fieldName"
        field :recurring, -> { Internal::Types::Boolean }, optional: true, nullable: false
        field :filters, -> { Internal::Types::Array[Novabilling::Types::CreateBillableMetricFilterDto] }, optional: true, nullable: false
      end
    end
  end
end
