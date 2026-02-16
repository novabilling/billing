# frozen_string_literal: true

module Novabilling
  module Plans
    module Types
      class UpdatePlanDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :name, -> { String }, optional: true, nullable: false
        field :description, -> { String }, optional: true, nullable: false
        field :billing_interval, -> { Novabilling::Plans::Types::UpdatePlanDtoBillingInterval }, optional: true, nullable: false, api_name: "billingInterval"
        field :billing_timing, -> { Novabilling::Plans::Types::UpdatePlanDtoBillingTiming }, optional: true, nullable: false, api_name: "billingTiming"
        field :features, -> { Internal::Types::Array[String] }, optional: true, nullable: false
        field :is_active, -> { Internal::Types::Boolean }, optional: true, nullable: false, api_name: "isActive"
        field :net_payment_terms, -> { Integer }, optional: true, nullable: false, api_name: "netPaymentTerms"
        field :invoice_grace_period_days, -> { Integer }, optional: true, nullable: false, api_name: "invoiceGracePeriodDays"
        field :progressive_billing_threshold, -> { Integer }, optional: true, nullable: false, api_name: "progressiveBillingThreshold"
      end
    end
  end
end
