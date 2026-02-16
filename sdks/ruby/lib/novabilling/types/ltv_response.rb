# frozen_string_literal: true

module Novabilling
  module Types
    class LtvResponse < Internal::Types::Model
      field :avg_ltv, -> { Integer }, optional: false, nullable: false, api_name: "avgLtv"
      field :avg_lifespan_days, -> { Integer }, optional: false, nullable: false, api_name: "avgLifespanDays"
      field :by_plan, -> { Internal::Types::Array[Novabilling::Types::LtvPlanBreakdown] }, optional: false, nullable: false, api_name: "byPlan"
    end
  end
end
