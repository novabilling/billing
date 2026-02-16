# frozen_string_literal: true

module Novabilling
  module Types
    class MrrBreakdownResponse < Internal::Types::Model
      field :total_mrr, -> { Integer }, optional: false, nullable: false, api_name: "totalMrr"
      field :new_mrr, -> { Integer }, optional: false, nullable: false, api_name: "newMrr"
      field :expansion_mrr, -> { Integer }, optional: false, nullable: false, api_name: "expansionMrr"
      field :contraction_mrr, -> { Integer }, optional: false, nullable: false, api_name: "contractionMrr"
      field :churn_mrr, -> { Integer }, optional: false, nullable: false, api_name: "churnMrr"
      field :net_new_mrr, -> { Integer }, optional: false, nullable: false, api_name: "netNewMrr"
      field :by_plan, -> { Internal::Types::Array[Novabilling::Types::MrrPlanBreakdown] }, optional: false, nullable: false, api_name: "byPlan"
    end
  end
end
