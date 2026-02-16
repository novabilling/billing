# frozen_string_literal: true

module Novabilling
  module Types
    class SubscriptionPlanResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :name, -> { String }, optional: false, nullable: false
      field :billing_interval, -> { Novabilling::Types::SubscriptionPlanResponseBillingInterval }, optional: false, nullable: false, api_name: "billingInterval"
    end
  end
end
