# frozen_string_literal: true

module Novabilling
  module Types
    class MrrPlanBreakdown < Internal::Types::Model
      field :plan_id, -> { String }, optional: false, nullable: false, api_name: "planId"
      field :plan_name, -> { String }, optional: false, nullable: false, api_name: "planName"
      field :mrr, -> { Integer }, optional: false, nullable: false
      field :subscription_count, -> { Integer }, optional: false, nullable: false, api_name: "subscriptionCount"
    end
  end
end
