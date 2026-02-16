# frozen_string_literal: true

module Novabilling
  module Types
    class SubscriptionResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :external_id, -> { String }, optional: true, nullable: false, api_name: "externalId"
      field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
      field :plan_id, -> { String }, optional: false, nullable: false, api_name: "planId"
      field :previous_plan_id, -> { String }, optional: true, nullable: false, api_name: "previousPlanId"
      field :status, -> { Novabilling::Types::SubscriptionResponseStatus }, optional: false, nullable: false
      field :currency, -> { String }, optional: false, nullable: false
      field :billing_timing, -> { Novabilling::Types::SubscriptionResponseBillingTiming }, optional: false, nullable: false, api_name: "billingTiming"
      field :current_period_start, -> { String }, optional: false, nullable: false, api_name: "currentPeriodStart"
      field :current_period_end, -> { String }, optional: false, nullable: false, api_name: "currentPeriodEnd"
      field :cancel_at, -> { String }, optional: true, nullable: false, api_name: "cancelAt"
      field :canceled_at, -> { String }, optional: true, nullable: false, api_name: "canceledAt"
      field :trial_start, -> { String }, optional: true, nullable: false, api_name: "trialStart"
      field :trial_end, -> { String }, optional: true, nullable: false, api_name: "trialEnd"
      field :started_at, -> { String }, optional: false, nullable: false, api_name: "startedAt"
      field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      field :customer, -> { Novabilling::Types::SubscriptionCustomerResponse }, optional: true, nullable: false
      field :plan, -> { Novabilling::Types::SubscriptionPlanResponse }, optional: true, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
