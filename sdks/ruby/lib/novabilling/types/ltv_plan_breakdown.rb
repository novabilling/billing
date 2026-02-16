# frozen_string_literal: true

module Novabilling
  module Types
    class LtvPlanBreakdown < Internal::Types::Model
      field :plan_id, -> { String }, optional: false, nullable: false, api_name: "planId"
      field :plan_name, -> { String }, optional: false, nullable: false, api_name: "planName"
      field :avg_ltv, -> { Integer }, optional: false, nullable: false, api_name: "avgLtv"
      field :avg_lifespan_days, -> { Integer }, optional: false, nullable: false, api_name: "avgLifespanDays"
    end
  end
end
