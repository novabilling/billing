# frozen_string_literal: true

module Novabilling
  module Types
    class PlanOverrideResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
      field :plan_id, -> { String }, optional: false, nullable: false, api_name: "planId"
      field :overridden_prices, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false, api_name: "overriddenPrices"
      field :overridden_minimum_commitment, -> { Integer }, optional: true, nullable: false, api_name: "overriddenMinimumCommitment"
      field :overridden_charges, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false, api_name: "overriddenCharges"
      field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
