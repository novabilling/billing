# frozen_string_literal: true

module Novabilling
  module Plans
    module Types
      class CreatePlanDto < Internal::Types::Model
        field :name, -> { String }, optional: false, nullable: false
        field :code, -> { String }, optional: false, nullable: false
        field :description, -> { String }, optional: true, nullable: false
        field :billing_interval, -> { Novabilling::Plans::Types::CreatePlanDtoBillingInterval }, optional: false, nullable: false, api_name: "billingInterval"
        field :billing_timing, -> { Novabilling::Plans::Types::CreatePlanDtoBillingTiming }, optional: true, nullable: false, api_name: "billingTiming"
        field :features, -> { Internal::Types::Array[String] }, optional: true, nullable: false
        field :prices, -> { Internal::Types::Array[Novabilling::Types::CreatePlanPriceDto] }, optional: true, nullable: false
        field :net_payment_terms, -> { Integer }, optional: true, nullable: false, api_name: "netPaymentTerms"
        field :invoice_grace_period_days, -> { Integer }, optional: true, nullable: false, api_name: "invoiceGracePeriodDays"
        field :progressive_billing_threshold, -> { Integer }, optional: true, nullable: false, api_name: "progressiveBillingThreshold"
      end
    end
  end
end
