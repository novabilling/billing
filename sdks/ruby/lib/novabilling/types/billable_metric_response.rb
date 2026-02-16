# frozen_string_literal: true

module Novabilling
  module Types
    class BillableMetricResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :name, -> { String }, optional: false, nullable: false
      field :code, -> { String }, optional: false, nullable: false
      field :description, -> { String }, optional: true, nullable: false
      field :aggregation_type, -> { Novabilling::Types::BillableMetricResponseAggregationType }, optional: false, nullable: false, api_name: "aggregationType"
      field :field_name, -> { String }, optional: true, nullable: false, api_name: "fieldName"
      field :recurring, -> { Internal::Types::Boolean }, optional: false, nullable: false
      field :filters, -> { Internal::Types::Array[Novabilling::Types::BillableMetricFilterResponse] }, optional: false, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
