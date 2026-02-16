# frozen_string_literal: true

module Novabilling
  module Types
    class MessageResponse < Internal::Types::Model
      field :message, -> { String }, optional: false, nullable: false
    end
  end
end
