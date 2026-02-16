# frozen_string_literal: true

module Novabilling
  module Types
    class BatchEventResponse < Internal::Types::Model
      field :received, -> { Integer }, optional: false, nullable: false
      field :processed, -> { Integer }, optional: false, nullable: false
      field :duplicates, -> { Integer }, optional: false, nullable: false
    end
  end
end
