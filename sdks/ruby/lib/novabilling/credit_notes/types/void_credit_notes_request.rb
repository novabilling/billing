# frozen_string_literal: true

module Novabilling
  module CreditNotes
    module Types
      class VoidCreditNotesRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
