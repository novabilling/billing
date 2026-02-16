# frozen_string_literal: true

module Novabilling
  module BillableMetrics
    module Types
      class GetBillableMetricsRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
