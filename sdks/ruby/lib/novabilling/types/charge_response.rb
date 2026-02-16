# frozen_string_literal: true

module Novabilling
  module Types
    class ChargeResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :plan_id, -> { String }, optional: false, nullable: false, api_name: "planId"
      field :billable_metric_id, -> { String }, optional: false, nullable: false, api_name: "billableMetricId"
      field :charge_model, -> { Novabilling::Types::ChargeResponseChargeModel }, optional: false, nullable: false, api_name: "chargeModel"
      field :billing_timing, -> { Novabilling::Types::ChargeResponseBillingTiming }, optional: false, nullable: false, api_name: "billingTiming"
      field :invoice_display_name, -> { String }, optional: true, nullable: false, api_name: "invoiceDisplayName"
      field :min_amount_cents, -> { Integer }, optional: true, nullable: false, api_name: "minAmountCents"
      field :prorated, -> { Internal::Types::Boolean }, optional: false, nullable: false
      field :properties, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      field :graduated_ranges, -> { Internal::Types::Array[Novabilling::Types::ChargeGraduatedRangeResponse] }, optional: false, nullable: false, api_name: "graduatedRanges"
      field :filters, -> { Internal::Types::Array[Novabilling::Types::ChargeFilterResponse] }, optional: false, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
