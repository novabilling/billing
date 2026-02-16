# frozen_string_literal: true

module Novabilling
  module Plans
    module Types
      class DeletePlansRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
