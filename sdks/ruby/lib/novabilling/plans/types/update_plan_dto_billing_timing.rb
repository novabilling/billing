# frozen_string_literal: true

module Novabilling
  module Plans
    module Types
      module UpdatePlanDtoBillingTiming
        extend Novabilling::Internal::Types::Enum

        IN_ADVANCE = "IN_ADVANCE"
        IN_ARREARS = "IN_ARREARS"
      end
    end
  end
end
