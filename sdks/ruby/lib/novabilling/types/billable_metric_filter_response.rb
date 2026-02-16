# frozen_string_literal: true

module Novabilling
  module Types
    class BillableMetricFilterResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :billable_metric_id, -> { String }, optional: false, nullable: false, api_name: "billableMetricId"
      field :key, -> { String }, optional: false, nullable: false
      field :values, -> { Internal::Types::Array[String] }, optional: false, nullable: false
    end
  end
end
