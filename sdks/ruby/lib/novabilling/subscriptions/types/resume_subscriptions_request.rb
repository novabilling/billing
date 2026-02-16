# frozen_string_literal: true

module Novabilling
  module Subscriptions
    module Types
      class ResumeSubscriptionsRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
