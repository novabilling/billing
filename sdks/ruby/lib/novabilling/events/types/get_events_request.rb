# frozen_string_literal: true

module Novabilling
  module Events
    module Types
      class GetEventsRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
