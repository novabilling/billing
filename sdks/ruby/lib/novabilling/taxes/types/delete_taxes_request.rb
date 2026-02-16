# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class DeleteTaxesRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
