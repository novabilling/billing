# frozen_string_literal: true

module Novabilling
  module Types
    class CohortRow < Internal::Types::Model
      field :month, -> { String }, optional: false, nullable: false
      field :total_customers, -> { Integer }, optional: false, nullable: false, api_name: "totalCustomers"
      field :retention_percentages, -> { Internal::Types::Array[Integer] }, optional: false, nullable: false, api_name: "retentionPercentages"
    end
  end
end
