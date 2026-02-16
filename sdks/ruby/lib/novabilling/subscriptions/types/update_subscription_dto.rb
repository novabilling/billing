# frozen_string_literal: true

module Novabilling
  module Subscriptions
    module Types
      class UpdateSubscriptionDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      end
    end
  end
end
