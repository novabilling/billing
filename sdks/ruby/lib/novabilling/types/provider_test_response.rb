# frozen_string_literal: true

module Novabilling
  module Types
    class ProviderTestResponse < Internal::Types::Model
      field :success, -> { Internal::Types::Boolean }, optional: false, nullable: false
      field :message, -> { String }, optional: false, nullable: false
    end
  end
end
