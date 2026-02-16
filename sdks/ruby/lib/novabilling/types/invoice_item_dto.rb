# frozen_string_literal: true

module Novabilling
  module Types
    class InvoiceItemDto < Internal::Types::Model
      field :description, -> { String }, optional: false, nullable: false
      field :quantity, -> { Integer }, optional: false, nullable: false
      field :unit_amount, -> { Integer }, optional: false, nullable: false, api_name: "unitAmount"
    end
  end
end
