# frozen_string_literal: true

module Novabilling
  module Plans
    module Types
      class AddPricePlansRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :body, -> { Novabilling::Types::CreatePlanPriceDto }, optional: false, nullable: false
      end
    end
  end
end
