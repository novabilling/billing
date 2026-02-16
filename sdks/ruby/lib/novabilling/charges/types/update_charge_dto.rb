# frozen_string_literal: true

module Novabilling
  module Charges
    module Types
      class UpdateChargeDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :billing_timing, -> { Novabilling::Charges::Types::UpdateChargeDtoBillingTiming }, optional: true, nullable: false, api_name: "billingTiming"
        field :invoice_display_name, -> { String }, optional: true, nullable: false, api_name: "invoiceDisplayName"
        field :min_amount_cents, -> { Integer }, optional: true, nullable: false, api_name: "minAmountCents"
        field :prorated, -> { Internal::Types::Boolean }, optional: true, nullable: false
        field :properties, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
        field :graduated_ranges, -> { Internal::Types::Array[Novabilling::Types::GraduatedRangeDto] }, optional: true, nullable: false, api_name: "graduatedRanges"
        field :filters, -> { Internal::Types::Array[Novabilling::Types::ChargeFilterDto] }, optional: true, nullable: false
      end
    end
  end
end
