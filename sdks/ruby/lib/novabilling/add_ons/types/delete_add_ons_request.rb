# frozen_string_literal: true

module Novabilling
  module AddOns
    module Types
      class DeleteAddOnsRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
