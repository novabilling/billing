# frozen_string_literal: true

module Novabilling
  module Events
    module Types
      class BatchEventsDto < Internal::Types::Model
        field :events, -> { Internal::Types::Array[Novabilling::Types::CreateEventDto] }, optional: false, nullable: false
      end
    end
  end
end
