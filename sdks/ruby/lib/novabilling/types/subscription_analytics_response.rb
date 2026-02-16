# frozen_string_literal: true

module Novabilling
  module Types
    class SubscriptionAnalyticsResponse < Internal::Types::Model
      field :total, -> { Integer }, optional: false, nullable: false
      field :active, -> { Integer }, optional: false, nullable: false
      field :canceled, -> { Integer }, optional: false, nullable: false
      field :trialing, -> { Integer }, optional: false, nullable: false
      field :paused, -> { Integer }, optional: false, nullable: false
      field :new_subscriptions, -> { Integer }, optional: false, nullable: false, api_name: "newSubscriptions"
      field :churn_rate, -> { String }, optional: false, nullable: false, api_name: "churnRate"
      field :retention_rate, -> { String }, optional: false, nullable: false, api_name: "retentionRate"
    end
  end
end
