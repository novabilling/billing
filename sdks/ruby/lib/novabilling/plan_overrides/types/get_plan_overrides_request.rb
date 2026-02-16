# frozen_string_literal: true

module Novabilling
  module PlanOverrides
    module Types
      class GetPlanOverridesRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
