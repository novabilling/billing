# frozen_string_literal: true

module Novabilling
  module Types
    class CustomerAnalyticsResponse < Internal::Types::Model
      field :total_customers, -> { Integer }, optional: false, nullable: false, api_name: "totalCustomers"
      field :new_customers, -> { Integer }, optional: false, nullable: false, api_name: "newCustomers"
      field :arpu, -> { String }, optional: false, nullable: false
      field :total_revenue, -> { String }, optional: false, nullable: false, api_name: "totalRevenue"
    end
  end
end
