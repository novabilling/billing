# frozen_string_literal: true

module Novabilling
  module Analytics
    module Types
      class GetMrrBreakdownAnalyticsRequest < Internal::Types::Model
        field :date_from, -> { String }, optional: true, nullable: false, api_name: "dateFrom"
        field :date_to, -> { String }, optional: true, nullable: false, api_name: "dateTo"
        field :currency, -> { String }, optional: true, nullable: false
        field :group_by, -> { Novabilling::Analytics::Types::GetMrrBreakdownAnalyticsRequestGroupBy }, optional: true, nullable: false, api_name: "groupBy"
      end
    end
  end
end
