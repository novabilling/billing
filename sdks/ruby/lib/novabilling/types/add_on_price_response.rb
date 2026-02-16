# frozen_string_literal: true

module Novabilling
  module Types
    class AddOnPriceResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :add_on_id, -> { String }, optional: false, nullable: false, api_name: "addOnId"
      field :currency, -> { String }, optional: false, nullable: false
      field :amount, -> { String }, optional: false, nullable: false
    end
  end
end
