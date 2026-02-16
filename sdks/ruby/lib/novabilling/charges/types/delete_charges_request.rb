# frozen_string_literal: true

module Novabilling
  module Charges
    module Types
      class DeleteChargesRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
