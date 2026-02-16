# frozen_string_literal: true

module Novabilling
  module Subscriptions
    module Types
      class CancelSubscriptionDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :cancel_at, -> { Novabilling::Subscriptions::Types::CancelSubscriptionDtoCancelAt }, optional: false, nullable: false, api_name: "cancelAt"
      end
    end
  end
end
