# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class GetTaxesRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
