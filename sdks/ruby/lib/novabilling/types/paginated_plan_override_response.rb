# frozen_string_literal: true

module Novabilling
  module Types
    class PaginatedPlanOverrideResponse < Internal::Types::Model
      field :data, -> { Internal::Types::Array[Novabilling::Types::PlanOverrideResponse] }, optional: false, nullable: false
      field :meta, -> { Internal::Types::Hash[String, Object] }, optional: false, nullable: false
    end
  end
end
