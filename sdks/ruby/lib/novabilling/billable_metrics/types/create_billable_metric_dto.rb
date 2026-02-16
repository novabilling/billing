# frozen_string_literal: true

module Novabilling
  module BillableMetrics
    module Types
      class CreateBillableMetricDto < Internal::Types::Model
        field :name, -> { String }, optional: false, nullable: false
        field :code, -> { String }, optional: false, nullable: false
        field :description, -> { String }, optional: true, nullable: false
        field :aggregation_type, -> { Novabilling::BillableMetrics::Types::CreateBillableMetricDtoAggregationType }, optional: false, nullable: false, api_name: "aggregationType"
        field :field_name, -> { String }, optional: true, nullable: false, api_name: "fieldName"
        field :recurring, -> { Internal::Types::Boolean }, optional: true, nullable: false
        field :filters, -> { Internal::Types::Array[Novabilling::Types::CreateBillableMetricFilterDto] }, optional: true, nullable: false
      end
    end
  end
end
