# frozen_string_literal: true

module Novabilling
  module Plans
    module Types
      class UpdatePricePlansRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :price_id, -> { String }, optional: false, nullable: false, api_name: "priceId"
      end
    end
  end
end
