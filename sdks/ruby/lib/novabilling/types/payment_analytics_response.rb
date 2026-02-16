# frozen_string_literal: true

module Novabilling
  module Types
    class PaymentAnalyticsResponse < Internal::Types::Model
      field :total_payments, -> { Integer }, optional: false, nullable: false, api_name: "totalPayments"
      field :succeeded, -> { Integer }, optional: false, nullable: false
      field :failed, -> { Integer }, optional: false, nullable: false
      field :pending, -> { Integer }, optional: false, nullable: false
      field :success_rate, -> { String }, optional: false, nullable: false, api_name: "successRate"
    end
  end
end
