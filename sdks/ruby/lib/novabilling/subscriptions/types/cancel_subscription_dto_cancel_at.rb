# frozen_string_literal: true

module Novabilling
  module Subscriptions
    module Types
      module CancelSubscriptionDtoCancelAt
        extend Novabilling::Internal::Types::Enum

        NOW = "now"
        PERIOD_END = "period_end"
      end
    end
  end
end
