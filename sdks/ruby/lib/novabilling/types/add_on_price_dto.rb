# frozen_string_literal: true

module Novabilling
  module Types
    class AddOnPriceDto < Internal::Types::Model
      field :currency, -> { String }, optional: false, nullable: false
      field :amount, -> { Integer }, optional: false, nullable: false
    end
  end
end
