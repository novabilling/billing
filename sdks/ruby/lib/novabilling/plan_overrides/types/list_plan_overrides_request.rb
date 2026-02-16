# frozen_string_literal: true

module Novabilling
  module PlanOverrides
    module Types
      class ListPlanOverridesRequest < Internal::Types::Model
        field :customer_id, -> { String }, optional: true, nullable: false, api_name: "customerId"
        field :plan_id, -> { String }, optional: true, nullable: false, api_name: "planId"
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
