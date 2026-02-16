# frozen_string_literal: true

module Novabilling
  module Types
    class RevenueAnalyticsResponse < Internal::Types::Model
      field :total_revenue, -> { String }, optional: false, nullable: false, api_name: "totalRevenue"
      field :invoice_count, -> { Integer }, optional: false, nullable: false, api_name: "invoiceCount"
      field :mrr, -> { String }, optional: false, nullable: false
      field :arr, -> { String }, optional: false, nullable: false
    end
  end
end
