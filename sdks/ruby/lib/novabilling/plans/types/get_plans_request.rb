# frozen_string_literal: true

module Novabilling
  module Plans
    module Types
      class GetPlansRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
