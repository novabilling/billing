# frozen_string_literal: true

module Novabilling
  module Types
    class ChurnCohortsResponse < Internal::Types::Model
      field :months, -> { Internal::Types::Array[String] }, optional: false, nullable: false
      field :cohorts, -> { Internal::Types::Array[Novabilling::Types::CohortRow] }, optional: false, nullable: false
    end
  end
end
