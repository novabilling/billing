# frozen_string_literal: true

module Novabilling
  module Types
    module PlanResponseBillingTiming
      extend Novabilling::Internal::Types::Enum

      IN_ADVANCE = "IN_ADVANCE"
      IN_ARREARS = "IN_ARREARS"
    end
  end
end
