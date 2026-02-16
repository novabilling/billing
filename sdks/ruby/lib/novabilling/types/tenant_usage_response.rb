# frozen_string_literal: true

module Novabilling
  module Types
    class TenantUsageResponse < Internal::Types::Model
      field :customers, -> { Integer }, optional: false, nullable: false
      field :active_subscriptions, -> { Integer }, optional: false, nullable: false, api_name: "activeSubscriptions"
      field :total_invoices, -> { Integer }, optional: false, nullable: false, api_name: "totalInvoices"
      field :total_revenue, -> { String }, optional: false, nullable: false, api_name: "totalRevenue"
    end
  end
end
