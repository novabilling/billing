# frozen_string_literal: true

module Novabilling
  module Subscriptions
    module Types
      module CreateSubscriptionDtoStatus
        extend Novabilling::Internal::Types::Enum

        ACTIVE = "ACTIVE"
        TRIALING = "TRIALING"
        PAUSED = "PAUSED"
        PAST_DUE = "PAST_DUE"
        CANCELED = "CANCELED"
      end
    end
  end
end
