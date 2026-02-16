# frozen_string_literal: true

module Novabilling
  module Plans
    module Types
      class ListPlansRequest < Internal::Types::Model
        field :is_active, -> { Internal::Types::Boolean }, optional: true, nullable: false, api_name: "isActive"
      end
    end
  end
end
