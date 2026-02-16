# frozen_string_literal: true

module Novabilling
  module Subscriptions
    module Types
      class CreateSubscriptionDto < Internal::Types::Model
        field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
        field :plan_id, -> { String }, optional: false, nullable: false, api_name: "planId"
        field :currency, -> { String }, optional: false, nullable: false
        field :trial_days, -> { Integer }, optional: true, nullable: false, api_name: "trialDays"
        field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
        field :start_date, -> { String }, optional: true, nullable: false, api_name: "startDate"
        field :current_period_end, -> { String }, optional: true, nullable: false, api_name: "currentPeriodEnd"
        field :status, -> { Novabilling::Subscriptions::Types::CreateSubscriptionDtoStatus }, optional: true, nullable: false
        field :created_at, -> { String }, optional: true, nullable: false, api_name: "createdAt"
        field :external_id, -> { String }, optional: true, nullable: false, api_name: "externalId"
        field :canceled_at, -> { String }, optional: true, nullable: false, api_name: "canceledAt"
      end
    end
  end
end
