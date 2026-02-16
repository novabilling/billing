# frozen_string_literal: true

module Novabilling
  module APIKeys
    module Types
      class DeleteAPIKeysRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
