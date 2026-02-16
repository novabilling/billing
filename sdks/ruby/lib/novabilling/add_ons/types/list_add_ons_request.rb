# frozen_string_literal: true

module Novabilling
  module AddOns
    module Types
      class ListAddOnsRequest < Internal::Types::Model
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
