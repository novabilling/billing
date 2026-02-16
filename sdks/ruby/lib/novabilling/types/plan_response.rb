# frozen_string_literal: true

module Novabilling
  module Types
    class PlanResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :name, -> { String }, optional: false, nullable: false
      field :code, -> { String }, optional: false, nullable: false
      field :description, -> { String }, optional: true, nullable: false
      field :billing_interval, -> { Novabilling::Types::PlanResponseBillingInterval }, optional: false, nullable: false, api_name: "billingInterval"
      field :features, -> { Internal::Types::Array[String] }, optional: true, nullable: false
      field :is_active, -> { Internal::Types::Boolean }, optional: false, nullable: false, api_name: "isActive"
      field :billing_timing, -> { Novabilling::Types::PlanResponseBillingTiming }, optional: false, nullable: false, api_name: "billingTiming"
      field :minimum_commitment, -> { String }, optional: true, nullable: false, api_name: "minimumCommitment"
      field :prices, -> { Internal::Types::Array[Novabilling::Types::PlanPriceResponse] }, optional: false, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
