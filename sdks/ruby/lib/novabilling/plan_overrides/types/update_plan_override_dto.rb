# frozen_string_literal: true

module Novabilling
  module PlanOverrides
    module Types
      class UpdatePlanOverrideDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :overridden_prices, -> { Internal::Types::Array[String] }, optional: true, nullable: false, api_name: "overriddenPrices"
        field :overridden_minimum_commitment, -> { Integer }, optional: true, nullable: false, api_name: "overriddenMinimumCommitment"
        field :overridden_charges, -> { Internal::Types::Array[String] }, optional: true, nullable: false, api_name: "overriddenCharges"
        field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      end
    end
  end
end
