# frozen_string_literal: true

module Novabilling
  module Types
    module PlanResponseBillingInterval
      extend Novabilling::Internal::Types::Enum

      HOURLY = "HOURLY"
      DAILY = "DAILY"
      WEEKLY = "WEEKLY"
      MONTHLY = "MONTHLY"
      QUARTERLY = "QUARTERLY"
      YEARLY = "YEARLY"
    end
  end
end
