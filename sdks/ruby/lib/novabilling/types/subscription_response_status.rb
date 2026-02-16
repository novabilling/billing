# frozen_string_literal: true

module Novabilling
  module Types
    module SubscriptionResponseStatus
      extend Novabilling::Internal::Types::Enum

      ACTIVE = "ACTIVE"
      PAST_DUE = "PAST_DUE"
      CANCELED = "CANCELED"
      TRIALING = "TRIALING"
      PAUSED = "PAUSED"
    end
  end
end
