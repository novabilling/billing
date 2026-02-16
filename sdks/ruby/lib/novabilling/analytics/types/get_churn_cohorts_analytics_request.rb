# frozen_string_literal: true

module Novabilling
  module Analytics
    module Types
      class GetChurnCohortsAnalyticsRequest < Internal::Types::Model
        field :months, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
