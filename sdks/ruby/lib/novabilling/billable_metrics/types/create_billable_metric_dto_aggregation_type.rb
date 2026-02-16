# frozen_string_literal: true

module Novabilling
  module BillableMetrics
    module Types
      module CreateBillableMetricDtoAggregationType
        extend Novabilling::Internal::Types::Enum

        COUNT = "COUNT"
        SUM = "SUM"
        MAX = "MAX"
        UNIQUE_COUNT = "UNIQUE_COUNT"
        LATEST = "LATEST"
        WEIGHTED_SUM = "WEIGHTED_SUM"
      end
    end
  end
end
