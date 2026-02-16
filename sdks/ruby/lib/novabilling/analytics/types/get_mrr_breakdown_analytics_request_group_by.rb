# frozen_string_literal: true

module Novabilling
  module Analytics
    module Types
      module GetMrrBreakdownAnalyticsRequestGroupBy
        extend Novabilling::Internal::Types::Enum

        DAY = "day"
        WEEK = "week"
        MONTH = "month"
      end
    end
  end
end
